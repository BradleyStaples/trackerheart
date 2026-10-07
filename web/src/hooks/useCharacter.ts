import {subscribeToOwnedCharacter} from '../utils/firestore';
import useLiveValue from './useLiveValue';

// The current user's Character, kept up to date in real time. undefined while
// loading, null when it doesn't exist or belongs to someone else.
export default function useCharacter(characterId: string | undefined) {
  return useLiveValue(characterId, subscribeToOwnedCharacter, 'Character');
}
