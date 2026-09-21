import type {Character, Game, GameInput, CharacterInput} from '../utils/types';
import useUUID from './useUUID';
import {
  getGamesForDevice,
  getGameById,
  getCharactersForDevice,
  getCharacterById,
  createGame,
  updateGame,
  createCharacter,
  updateCharacter,
  getGameByShareCode,
  addCharacterToGame,
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

  // Same as saveGame, for Characters.
  const saveCharacter = async ({
    id,
    ...input
  }: CharacterInput & {id?: string}) => {
    if (id) {
      await updateCharacter(id, input);
      return id;
    }
    if (!deviceId) {
      throw new Error('Cannot create a Character without a device ID.');
    }
    const character = await createCharacter({...input, deviceId});
    return character.id;
  };

  // Links the Character to the Game with the given share code. Resolves to
  // the Game, or undefined when no Game has that share code. Errors are left
  // to the caller so the UI can report them.
  const joinGame = async (characterId: string, shareCode: string) => {
    const game = await getGameByShareCode(shareCode);
    if (!game) return undefined;
    await addCharacterToGame(characterId, game.id);
    return game;
  };

  return {
    getCharacters,
    getCharacter,
    getGames,
    getGame,
    saveGame,
    saveCharacter,
    joinGame,
  };
}
