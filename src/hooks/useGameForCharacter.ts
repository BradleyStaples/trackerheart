import {subscribeToGameForCharacter} from '../utils/firestore';
import useLiveValue from './useLiveValue';

// The Game the Character is playing in, kept up to date in real time.
// undefined while loading, null when the Character isn't in a Game.
export default function useGameForCharacter(characterId: string | undefined) {
  return useLiveValue(
    characterId,
    subscribeToGameForCharacter,
    'Game for Character',
  );
}
