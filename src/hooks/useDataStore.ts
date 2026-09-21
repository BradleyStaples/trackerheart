import type {Character, Game} from '../utils/types';
import useUUID from './useUUID';
import {
  getGamesForDevice,
  getGameById,
  getCharactersForDevice,
  getCharacterById,
} from '../utils/firestore';

export default function useDataStore() {
  const deviceId = useUUID();

  const getCharacters = () => {
    if (!deviceId) {
      return Promise.resolve([] as Character[]);
    }
    const characters = getCharactersForDevice(deviceId)
      .then((characters: Character[]) => {
        return characters;
      })
      .catch((error) => {
        console.error(error);
        return [];
      });
    return characters;
  };

  const getCharacter = (characterId: string) => {
    if (!deviceId) {
      return Promise.resolve(undefined);
    }
    const character = getCharacterById(characterId, deviceId)
      .then((character: Character | undefined) => {
        return character ?? undefined;
      })
      .catch((error) => {
        console.error(error);
        return undefined;
      });
    return character;
  };

  const getGames = () => {
    if (!deviceId) {
      return Promise.resolve([] as Game[]);
    }
    const games = getGamesForDevice(deviceId)
      .then((games: Game[]) => {
        return games;
      })
      .catch((error) => {
        console.error(error);
        return [];
      });
    return games;
  };

  const getGame = (gameId: string) => {
    if (!deviceId) {
      return Promise.resolve(undefined);
    }
    const game = getGameById(gameId, deviceId)
      .then((game: Game | undefined) => {
        return game ?? undefined;
      })
      .catch((error) => {
        console.error(error);
        return undefined;
      });
    return game;
  };

  return {getCharacters, getCharacter, getGames, getGame};
}
