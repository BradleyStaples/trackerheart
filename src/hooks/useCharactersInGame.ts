import {useEffect, useState} from 'react';
import {subscribeToCharactersInGame} from '../utils/firestore';
import type {Character} from '../utils/types';

// The Characters in the Game, kept up to date in real time. Starts from the
// server-rendered Characters so there is no loading state. Key the calling
// component on the Game's id so navigating between Games resets it.
export default function useCharactersInGame(
  gameId: string | undefined,
  initialCharacters: Character[],
) {
  const [characters, setCharacters] = useState(initialCharacters);

  useEffect(() => {
    if (!gameId) return;
    return subscribeToCharactersInGame(gameId, setCharacters, (error) =>
      console.error('Unable to follow Characters in Game', {error}),
    );
  }, [gameId]);

  return characters;
}
