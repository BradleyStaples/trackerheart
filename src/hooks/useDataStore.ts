import {useState} from 'react';
// import type {Character, Game} from '../utils/types';
import {data as dummyData} from '../utils/dummyData';

export default function useDataStore() {
  const [data, _setData] = useState(dummyData);

  const getCharacters = () => {
    return data.characters;
  };

  const getCharacter = (characterId: string) => {
    return data.characters.find(({id}) => {
      return id === characterId;
    });
  };

  const getGames = () => {
    return data.games;
  };

  const getGame = (gameId: string) => {
    return data.games.find(({id}) => {
      return id === gameId;
    });
  };

  return {getCharacters, getCharacter, getGames, getGame};
}
