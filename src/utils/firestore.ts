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
} from 'firebase/firestore';
import type {Game, Character, GameInput, NewGameInput} from './types';

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
  if (gameIds.length === 0) return undefined;

  const gamesQuery = query(
    collection(getDb(), 'Games'),
    where(documentId(), 'in', gameIds),
  );

  const gamesSnapshot = await getDocs(gamesQuery);
  const games = gamesSnapshot.docs.map(
    (doc) => ({id: doc.id, ...doc.data()}) as Game,
  );
  return games[0];
}
