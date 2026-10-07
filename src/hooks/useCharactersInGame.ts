import {subscribeToCharactersInGame} from '../utils/firestore';
import type {Character} from '../utils/types';
import useLiveValue from './useLiveValue';

const NO_CHARACTERS: Character[] = [];

// The Characters in the GM's Game, kept up to date in real time. Empty while
// loading.
export default function useCharactersInGame(gameId: string | undefined) {
  return (
    useLiveValue(gameId, subscribeToCharactersInGame, 'Characters in Game') ??
    NO_CHARACTERS
  );
}
