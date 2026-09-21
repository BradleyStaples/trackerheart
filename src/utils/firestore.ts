import {initializeApp, getApp, getApps} from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  documentId,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import type {
  Game,
  Character,
  GameInput,
  NewGameInput,
  CharacterInput,
  NewCharacterInput,
} from './types';

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

export function getDb() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

async function queryByFieldAndDeviceId<T>(
  collectionName: string,
  field: string,
  value: string,
  deviceId: string | null,
): Promise<T[]> {
  const q = query(
    collection(getDb(), collectionName),
    where(field, '==', value),
    where('deviceId', '==', deviceId),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}) as T);
}

async function queryByField<T>(
  collectionName: string,
  field: string,
  value: string,
): Promise<T[]> {
  const q = query(
    collection(getDb(), collectionName),
    where(field, '==', value),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}) as T);
}

export async function getGamesForDevice(deviceId: string): Promise<Game[]> {
  try {
    return await queryByField<Game>('Games', 'deviceId', deviceId);
  } catch (error) {
    console.error('Error fetching Games by device ID:', error);
    throw error;
  }
}

export async function getGameById(
  gameId: string,
  deviceId: string | null,
): Promise<Game | undefined> {
  try {
    const games = await queryByFieldAndDeviceId<Game>(
      'Games',
      '__name__',
      gameId,
      deviceId,
    );
    return games[0];
  } catch (error) {
    console.error('Error fetching Game by id:', error);
    throw error;
  }
}

// The Game's id is the Firestore document ID, so it isn't stored in the data.
export async function createGame(input: NewGameInput): Promise<Game> {
  try {
    const gameRef = doc(collection(getDb(), 'Games'));
    await setDoc(gameRef, input);
    return {...input, id: gameRef.id};
  } catch (error) {
    console.error('Error creating Game:', error);
    throw error;
  }
}

// deviceId and shareCode are deliberately not editable after creation.
export async function updateGame(
  gameId: string,
  input: GameInput,
): Promise<void> {
  try {
    await updateDoc(doc(getDb(), 'Games', gameId), input);
  } catch (error) {
    console.error('Error updating Game:', error);
    throw error;
  }
}

export async function getCharactersForDevice(
  deviceId: string,
): Promise<Character[]> {
  try {
    return await queryByField<Character>('Characters', 'deviceId', deviceId);
  } catch (error) {
    console.error('Error fetching Characters by device ID:', error);
    throw error;
  }
}

export async function getCharacterById(
  characterId: string,
  deviceId: string | null,
): Promise<Character | undefined> {
  try {
    const characters = await queryByFieldAndDeviceId<Character>(
      'Characters',
      '__name__',
      characterId,
      deviceId,
    );
    return characters[0];
  } catch (error) {
    console.error('Error fetching Character by id:', error);
    throw error;
  }
}

export async function getCharactersInGame(gameId: string) {
  const q = query(
    collection(getDb(), 'GameCharacters'),
    where('gameId', '==', gameId),
  );
  const mappingSnapshot = await getDocs(q);
  const characterIds = mappingSnapshot.docs.map(
    (docSnap) => docSnap.data().characterId,
  );
  if (characterIds.length === 0) return [] as Character[];

  const charactersQuery = query(
    collection(getDb(), 'Characters'),
    where(documentId(), 'in', characterIds),
  );

  const charactersSnapshot = await getDocs(charactersQuery);
  return charactersSnapshot.docs.map(
    (doc) => ({id: doc.id, ...doc.data()}) as Character,
  );
}

export async function getGameForCharacter(characterId: string) {
  const q = query(
    collection(getDb(), 'GameCharacters'),
    where('characterId', '==', characterId),
  );
  const mappingSnapshot = await getDocs(q);
  const gameIds = mappingSnapshot.docs.map((docSnap) => docSnap.data().gameId);
  if (gameIds.length === 0) return null;

  const gamesQuery = query(
    collection(getDb(), 'Games'),
    where(documentId(), 'in', gameIds),
  );

  const gamesSnapshot = await getDocs(gamesQuery);
  const games = gamesSnapshot.docs.map(
    (doc) => ({id: doc.id, ...doc.data()}) as Game,
  );
  return games[0] ?? null;
}

// The Character's id is the Firestore document ID, so it isn't stored in the data.
export async function createCharacter(
  input: NewCharacterInput,
): Promise<Character> {
  try {
    const characterRef = doc(collection(getDb(), 'Characters'));
    await setDoc(characterRef, input);
    return {...input, id: characterRef.id};
  } catch (error) {
    console.error('Error creating Character:', error);
    throw error;
  }
}

// deviceId is deliberately not editable after creation.
export async function updateCharacter(
  characterId: string,
  input: CharacterInput,
): Promise<void> {
  try {
    await updateDoc(doc(getDb(), 'Characters', characterId), input);
  } catch (error) {
    console.error('Error updating Character:', error);
    throw error;
  }
}

// Share codes are shown to players with spaces between the characters, so
// ignore whitespace and case when matching.
export async function getGameByShareCode(
  shareCode: string,
): Promise<Game | undefined> {
  try {
    const normalizedShareCode = shareCode.replace(/\s+/g, '').toUpperCase();
    if (!normalizedShareCode) return undefined;
    const games = await queryByField<Game>(
      'Games',
      'shareCode',
      normalizedShareCode,
    );
    return games[0];
  } catch (error) {
    console.error('Error fetching Game by share code:', error);
    throw error;
  }
}

// The mapping's document ID is the characterId, since a Character plays in
// one Game at a time (see getGameForCharacter). Joining another Game
// replaces the previous mapping, and joining twice is harmless.
export async function addCharacterToGame(
  characterId: string,
  gameId: string,
): Promise<void> {
  try {
    await setDoc(doc(getDb(), 'GameCharacters', characterId), {
      characterId,
      gameId,
    });
  } catch (error) {
    console.error('Error adding Character to Game:', error);
    throw error;
  }
}

// Looks the mapping up by field rather than by document ID so mappings not
// created by addCharacterToGame (which uses the characterId as the ID) are
// removed too.
export async function removeCharacterFromGame(
  characterId: string,
  gameId: string,
): Promise<void> {
  try {
    const q = query(
      collection(getDb(), 'GameCharacters'),
      where('characterId', '==', characterId),
      where('gameId', '==', gameId),
    );
    const mappingSnapshot = await getDocs(q);
    await Promise.all(
      mappingSnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref)),
    );
  } catch (error) {
    console.error('Error removing Character from Game:', error);
    throw error;
  }
}
