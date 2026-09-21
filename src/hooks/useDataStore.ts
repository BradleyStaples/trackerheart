import {useState} from 'react';
import useFirebase from './useFirebase';
import type {Character, Game} from '../utils/types';
// import {data as dummyData} from '../utils/dummyData';

export default function useDataStore() {
  const {
    getGamesForDevice,
    getGameById,
    getCharactersForDevice,
    getCharacterById,
  } = useFirebase();

  const getCharacters = () => {
    const characters = getCharactersForDevice()
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
    const character = getCharacterById(characterId)
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
    const games = getGamesForDevice()
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
    const game = getGameById(gameId)
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
