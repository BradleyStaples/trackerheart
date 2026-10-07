import {subscribeToOwnedGame} from '../utils/firestore';
import useLiveValue from './useLiveValue';

// The current user's Game, kept up to date in real time. undefined while
// loading, null when it doesn't exist or belongs to someone else.
export default function useGame(gameId: string | undefined) {
  return useLiveValue(gameId, subscribeToOwnedGame, 'Game');
}
