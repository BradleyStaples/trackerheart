import {initializeApp, getApp, getApps} from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import type {Game, Character} from './types';

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

export async function getGameById(gameId: string): Promise<Game | undefined> {
  try {
    const games = await queryByField<Game>('Games', '__name__', gameId);
    return games[0];
  } catch (error) {
    console.error('Error fetching Game by id:', error);
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
): Promise<Character | undefined> {
  try {
    const characters = await queryByField<Character>(
      'Characters',
      '__name__',
      characterId,
    );
    return characters[0];
  } catch (error) {
    console.error('Error fetching Character by id:', error);
    throw error;
  }
}
