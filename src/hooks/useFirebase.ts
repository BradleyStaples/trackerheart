import useUUID from './useUUID';
import {
  getDb,
  getGamesForDevice,
  getGameById,
  getCharactersForDevice,
  getCharacterById,
} from '../utils/firestore';

// Client-side wrapper that supplies the current device's ID to the plain
// queries in utils/firestore.ts. Server code should call those directly.
export default function useFirebase() {
  const deviceId = useUUID();

  return {
    getDb,
    getGamesForDevice: async () =>
      deviceId ? getGamesForDevice(deviceId) : [],
    getGameById,
    getCharactersForDevice: async () =>
      deviceId ? getCharactersForDevice(deviceId) : [],
    getCharacterById,
  };
}
