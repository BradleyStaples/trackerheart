import type {Character, Game, GameInput} from '../utils/types';
import useUUID from './useUUID';
import {
  getGamesForDevice,
  getGameById,
  getCharactersForDevice,
  getCharacterById,
  createGame,
  updateGame,
} from '../utils/firestore';
import {createShareCode} from '../utils/utils';

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

  // Updates the Game when an id is given, otherwise creates it for this
  // device. Resolves to the Game's id. Errors are left to the caller so the
  // UI can report them.
  const saveGame = async ({id, ...input}: GameInput & {id?: string}) => {
    if (id) {
      await updateGame(id, input);
      return id;
    }
    if (!deviceId) {
      throw new Error('Cannot create a Game without a device ID.');
    }
    const game = await createGame({
      ...input,
      shareCode: createShareCode(),
      deviceId,
    });
    return game.id;
  };

  return {getCharacters, getCharacter, getGames, getGame, saveGame};
}
