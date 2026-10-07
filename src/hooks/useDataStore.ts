import type {GameInput, CharacterInput} from '../utils/types';
import {
  getGamesForCurrentUser,
  getCharactersForCurrentUser,
  createGame,
  updateGame,
  deleteGame,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  joinGame,
  removeCharacterFromGame,
} from '../utils/firestore';

export default function useDataStore() {
  const getCharacters = () =>
    getCharactersForCurrentUser().catch((error) => {
      console.error(error);
      return [];
    });

  const getGames = () =>
    getGamesForCurrentUser().catch((error) => {
      console.error(error);
      return [];
    });

  // Updates the Game when an id is given, otherwise creates it for the
  // current user. Resolves to the Game's id. Errors are left to the caller so
  // the UI can report them.
  const saveGame = async ({id, ...input}: GameInput & {id?: string}) => {
    if (id) {
      await updateGame(id, input);
      return id;
    }
    return createGame(input);
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
    return createCharacter(input);
  };

  // deleteCharacter, deleteGame, joinGame and leaveGame leave errors to the
  // caller so the UI can report them. joinGame resolves to the Game, or
  // undefined when no Game has that share code.
  return {
    getCharacters,
    getGames,
    saveGame,
    saveCharacter,
    deleteCharacter,
    deleteGame,
    joinGame,
    leaveGame: removeCharacterFromGame,
  };
}
