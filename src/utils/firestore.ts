import {initializeApp, getApp, getApps} from 'firebase/app';
import {getAuth, signInAnonymously} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  FirestoreError,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';
import type {Game, Character, GameInput, CharacterInput} from './types';
import {createShareCode} from './utils';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDy_Hn_qARAWXuZCk8kWTOK5govmZqgS1A',
  authDomain: 'trackerheart-ed2ae.firebaseapp.com',
  projectId: 'trackerheart-ed2ae',
  storageBucket: 'trackerheart-ed2ae.firebasestorage.app',
  messagingSenderId: '256853352755',
  appId: '1:256853352755:web:229456932fa00aabc01e46',
  measurementId: 'G-G4P1CFDNCG',
};

function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getDb() {
  return getFirestore(getFirebaseApp());
}

// Security rules identify users by their Firebase Auth uid, so every read and
// write waits for this first. Anonymous Auth gives each browser a uid that
// persists until its site data is cleared, without asking the user to log in.
let signInPromise: Promise<string> | undefined;

export function ensureSignedIn(): Promise<string> {
  signInPromise ??= (async () => {
    const auth = getAuth(getFirebaseApp());
    await auth.authStateReady();
    const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
    return user.uid;
  })().catch((error) => {
    // let the next call try again
    signInPromise = undefined;
    throw error;
  });
  return signInPromise;
}

// Firestore Timestamp instances aren't plain data our types can describe, so
// every place a document's data is read converts them to ISO strings first.
function mapDocumentData<T>(id: string, data: DocumentData): T {
  const result: Record<string, unknown> = {id, ...data};
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (value instanceof Timestamp) {
      result[key] = value.toDate().toISOString();
    }
  }
  return result as T;
}

function isPermissionDenied(error: unknown) {
  return error instanceof FirestoreError && error.code === 'permission-denied';
}

// Share codes are shown to players with spaces between the characters, so
// ignore whitespace and case when matching.
function normalizeShareCode(shareCode: string) {
  return shareCode.replace(/\s+/g, '').toUpperCase();
}

async function queryOwnedBy<T>(collectionName: string): Promise<T[]> {
  const uid = await ensureSignedIn();
  const q = query(
    collection(getDb(), collectionName),
    where('ownerUid', '==', uid),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap) =>
    mapDocumentData<T>(docSnap.id, docSnap.data()),
  );
}

export async function getGamesForCurrentUser(): Promise<Game[]> {
  try {
    return await queryOwnedBy<Game>('Games');
  } catch (error) {
    console.error('Error fetching Games for user:', error);
    throw error;
  }
}

export async function getCharactersForCurrentUser(): Promise<Character[]> {
  try {
    return await queryOwnedBy<Character>('Characters');
  } catch (error) {
    console.error('Error fetching Characters for user:', error);
    throw error;
  }
}

const MAX_SHARE_CODE_ATTEMPTS = 5;

// The Game and its ShareCodes entry are written in one batch, which security
// rules reject if the code already belongs to another Game. Codes already in
// use are skipped before writing, so a rejection is almost always a real error
// rather than a collision; it's retried anyway in case two GMs drew the same
// code at once.
//
// createdAt and lastModifiedAt are set from the server clock so devices with
// wrong or skewed clocks can't corrupt them. Resolves to the new Game's id.
export async function createGame(input: GameInput): Promise<string> {
  try {
    const uid = await ensureSignedIn();
    for (let attempt = 1; ; attempt++) {
      const shareCode = createShareCode();
      const shareCodeRef = doc(getDb(), 'ShareCodes', shareCode);
      if ((await getDoc(shareCodeRef)).exists()) continue;

      const gameRef = doc(collection(getDb(), 'Games'));
      const batch = writeBatch(getDb());
      batch.set(gameRef, {
        ...input,
        shareCode,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
      });
      batch.set(shareCodeRef, {gameId: gameRef.id, ownerUid: uid});
      try {
        await batch.commit();
        return gameRef.id;
      } catch (error) {
        if (!isPermissionDenied(error) || attempt >= MAX_SHARE_CODE_ATTEMPTS) {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Error creating Game:', error);
    throw error;
  }
}

// ownerUid and shareCode are deliberately not editable after creation.
export async function updateGame(
  gameId: string,
  input: GameInput,
): Promise<void> {
  try {
    await ensureSignedIn();
    await updateDoc(doc(getDb(), 'Games', gameId), {
      ...input,
      lastModifiedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating Game:', error);
    throw error;
  }
}

// Also removes the Game's share code and every GameCharacters mapping for it,
// all in one batch, so its Characters aren't left pointing at a Game that no
// longer exists.
export async function deleteGame(gameId: string): Promise<void> {
  try {
    const uid = await ensureSignedIn();
    const gameRef = doc(getDb(), 'Games', gameId);
    const gameSnap = await getDoc(gameRef);
    if (!gameSnap.exists() || gameSnap.data().ownerUid !== uid) {
      throw new Error('Game not found for this user.');
    }

    const mappingSnapshot = await getDocs(
      query(
        collection(getDb(), 'GameCharacters'),
        where('gameId', '==', gameId),
        where('gmUid', '==', uid),
      ),
    );
    const batch = writeBatch(getDb());
    batch.delete(gameRef);
    batch.delete(doc(getDb(), 'ShareCodes', gameSnap.data().shareCode));
    mappingSnapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
  } catch (error) {
    console.error('Error deleting Game:', error);
    throw error;
  }
}

// createdAt and lastModifiedAt are set from the server clock so devices with
// wrong or skewed clocks can't corrupt them. Resolves to the new Character's
// id.
export async function createCharacter(input: CharacterInput): Promise<string> {
  try {
    const uid = await ensureSignedIn();
    const characterRef = doc(collection(getDb(), 'Characters'));
    await setDoc(characterRef, {
      ...input,
      ownerUid: uid,
      createdAt: serverTimestamp(),
      lastModifiedAt: serverTimestamp(),
    });
    return characterRef.id;
  } catch (error) {
    console.error('Error creating Character:', error);
    throw error;
  }
}

// ownerUid is deliberately not editable after creation.
export async function updateCharacter(
  characterId: string,
  input: CharacterInput,
): Promise<void> {
  try {
    await ensureSignedIn();
    await updateDoc(doc(getDb(), 'Characters', characterId), {
      ...input,
      lastModifiedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating Character:', error);
    throw error;
  }
}

// Also removes the Character's GameCharacters mapping in the same batch, so it
// doesn't linger in a Game's character list once deleted. The mapping is
// found by query because deleting one that doesn't exist is rejected by
// security rules.
export async function deleteCharacter(characterId: string): Promise<void> {
  try {
    const uid = await ensureSignedIn();
    const mappingSnapshot = await getDocs(
      query(
        collection(getDb(), 'GameCharacters'),
        where('characterId', '==', characterId),
        where('playerUid', '==', uid),
      ),
    );
    const batch = writeBatch(getDb());
    batch.delete(doc(getDb(), 'Characters', characterId));
    mappingSnapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
  } catch (error) {
    console.error('Error deleting Character:', error);
    throw error;
  }
}

// Links the Character to the Game with the given share code. Resolves to the
// Game, or undefined when no Game has that share code.
//
// The mapping's document ID is the characterId, since a Character plays in
// one Game at a time. Joining another Game replaces the previous mapping, and
// joining twice is harmless; both count as a fresh create, so createdAt and
// lastModifiedAt are reset each time. The share code is stored so security
// rules can confirm the player was invited.
export async function joinGame(
  characterId: string,
  shareCode: string,
): Promise<Game | undefined> {
  try {
    const uid = await ensureSignedIn();
    const normalizedShareCode = normalizeShareCode(shareCode);
    if (!/^[0-9A-Z]{6}$/.test(normalizedShareCode)) return undefined;

    const shareCodeSnap = await getDoc(
      doc(getDb(), 'ShareCodes', normalizedShareCode),
    );
    if (!shareCodeSnap.exists()) return undefined;
    const {gameId, ownerUid: gmUid} = shareCodeSnap.data();

    const gameSnap = await getDoc(doc(getDb(), 'Games', gameId));
    if (!gameSnap.exists()) return undefined;

    await setDoc(doc(getDb(), 'GameCharacters', characterId), {
      characterId,
      gameId,
      playerUid: uid,
      gmUid,
      shareCode: normalizedShareCode,
      createdAt: serverTimestamp(),
      lastModifiedAt: serverTimestamp(),
    });
    return mapDocumentData<Game>(gameSnap.id, gameSnap.data());
  } catch (error) {
    console.error('Error joining Game:', error);
    throw error;
  }
}

// Used both by the player leaving and by the GM removing the Character.
export async function removeCharacterFromGame(
  characterId: string,
): Promise<void> {
  try {
    await ensureSignedIn();
    await deleteDoc(doc(getDb(), 'GameCharacters', characterId));
  } catch (error) {
    console.error('Error removing Character from Game:', error);
    throw error;
  }
}

// Real-time subscriptions. Each one calls its callback with the current data
// as soon as it's available and again on every change, and returns a function
// that stops listening. Errors (for example rejected by security rules) go to
// onError.

// Signs in, then starts the listeners. Stopping before sign-in finishes means
// they never start.
function subscribeAfterSignIn(
  start: (uid: string) => Unsubscribe,
  onError: (error: Error) => void,
): Unsubscribe {
  let stopped = false;
  let unsubscribe: Unsubscribe = () => {};
  ensureSignedIn().then((uid) => {
    if (!stopped) unsubscribe = start(uid);
  }, onError);
  return () => {
    stopped = true;
    unsubscribe();
  };
}

function subscribeToGame(
  gameId: string,
  onGame: (game: Game | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(getDb(), 'Games', gameId),
    (docSnap) =>
      onGame(
        docSnap.exists()
          ? mapDocumentData<Game>(docSnap.id, docSnap.data())
          : null,
      ),
    onError,
  );
}

// Calls back with null when the Game doesn't exist or belongs to another user.
export function subscribeToOwnedGame(
  gameId: string,
  onGame: (game: Game | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return subscribeAfterSignIn(
    (uid) =>
      subscribeToGame(
        gameId,
        (game) => onGame(game?.ownerUid === uid ? game : null),
        onError,
      ),
    onError,
  );
}

// Calls back with null when the Character doesn't exist or belongs to another
// user. Security rules reject reading either one, so rejections count as not
// found.
export function subscribeToOwnedCharacter(
  characterId: string,
  onCharacter: (character: Character | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return subscribeAfterSignIn(
    (uid) =>
      onSnapshot(
        doc(getDb(), 'Characters', characterId),
        (docSnap) => {
          const character = docSnap.exists()
            ? mapDocumentData<Character>(docSnap.id, docSnap.data())
            : null;
          onCharacter(character?.ownerUid === uid ? character : null);
        },
        (error) => {
          if (isPermissionDenied(error)) {
            onCharacter(null);
          } else {
            onError(error);
          }
        },
      ),
    onError,
  );
}

// Follows the Character's Game as it changes, including when the Character
// joins, leaves or switches Games. The callback receives null when the
// Character isn't in a Game.
export function subscribeToGameForCharacter(
  characterId: string,
  onGame: (game: Game | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return subscribeAfterSignIn((uid) => {
    let unsubscribeGame: Unsubscribe = () => {};
    // null until the first snapshot, so a Character that isn't in a Game
    // (gameId undefined) still gets reported
    let currentGameId: string | undefined | null = null;

    const unsubscribeMapping = onSnapshot(
      query(
        collection(getDb(), 'GameCharacters'),
        where('characterId', '==', characterId),
        where('playerUid', '==', uid),
      ),
      (mappingSnapshot) => {
        const gameId: string | undefined =
          mappingSnapshot.docs[0]?.data().gameId;
        if (gameId === currentGameId) return;
        currentGameId = gameId;

        unsubscribeGame();
        unsubscribeGame = () => {};
        if (!gameId) {
          onGame(null);
          return;
        }
        unsubscribeGame = subscribeToGame(gameId, onGame, onError);
      },
      onError,
    );

    return () => {
      unsubscribeMapping();
      unsubscribeGame();
    };
  }, onError);
}

// Follows the Characters in the GM's Game as they change, including when
// Characters join or leave. Each Character gets its own listener because
// security rules only let the GM read them one document at a time.
export function subscribeToCharactersInGame(
  gameId: string,
  onCharacters: (characters: Character[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return subscribeAfterSignIn((uid) => {
    const listeners = new Map<string, Unsubscribe>();
    // undefined until the Character's first snapshot arrives
    const characters = new Map<string, Character | undefined>();

    // Waits until every Character has loaded, so the list doesn't fill in
    // one at a time.
    const report = () => {
      if ([...characters.values()].some((c) => c === undefined)) return;
      onCharacters(
        [...characters.keys()]
          .sort()
          .map((id) => characters.get(id))
          .filter((c): c is Character => c !== undefined),
      );
    };

    const stopFollowing = (characterId: string) => {
      listeners.get(characterId)?.();
      listeners.delete(characterId);
      characters.delete(characterId);
    };

    const unsubscribeMappings = onSnapshot(
      query(
        collection(getDb(), 'GameCharacters'),
        where('gameId', '==', gameId),
        where('gmUid', '==', uid),
      ),
      (mappingSnapshot) => {
        const characterIds = new Set(
          mappingSnapshot.docs.map(
            (docSnap) => docSnap.data().characterId as string,
          ),
        );
        for (const characterId of listeners.keys()) {
          if (!characterIds.has(characterId)) stopFollowing(characterId);
        }
        for (const characterId of characterIds) {
          if (listeners.has(characterId)) continue;
          characters.set(characterId, undefined);
          listeners.set(
            characterId,
            onSnapshot(
              doc(getDb(), 'Characters', characterId),
              (docSnap) => {
                if (docSnap.exists()) {
                  characters.set(
                    characterId,
                    mapDocumentData<Character>(docSnap.id, docSnap.data()),
                  );
                } else {
                  stopFollowing(characterId);
                }
                report();
              },
              // Expected when the Character leaves the Game before its
              // mapping's removal reaches this listener.
              (error) => {
                stopFollowing(characterId);
                if (!isPermissionDenied(error)) onError(error);
                report();
              },
            ),
          );
        }
        report();
      },
      onError,
    );

    return () => {
      unsubscribeMappings();
      [...listeners.keys()].forEach(stopFollowing);
    };
  }, onError);
}
