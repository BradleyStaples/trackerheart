import {useEffect, useState} from 'react';
import {subscribeToGameForCharacter} from '../utils/firestore';
import type {Game} from '../utils/types';

// The Game the Character is playing in, kept up to date in real time. Starts
// from the server-rendered Game so there is no loading state. Key the calling
// component on the Character's id so navigating between Characters resets it.
export default function useGameForCharacter(
  characterId: string | undefined,
  initialGame: Game | undefined,
) {
  const [game, setGame] = useState(initialGame);

  useEffect(() => {
    if (!characterId) return;
    return subscribeToGameForCharacter(
      characterId,
      (liveGame) => setGame(liveGame ?? undefined),
      (error) => console.error('Unable to follow Game for Character', {error}),
    );
  }, [characterId]);

  return game;
}
