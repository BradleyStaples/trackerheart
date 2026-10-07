import {useEffect, useState} from 'react';
import type {Unsubscribe} from 'firebase/firestore';

type Subscribe<T> = (
  id: string,
  onValue: (value: T) => void,
  onError: (error: Error) => void,
) => Unsubscribe;

// Follows a value from one of the subscribe functions in utils/firestore.ts.
// Returns undefined while loading, including right after id changes, so a
// page never shows the previous id's data.
export default function useLiveValue<T>(
  id: string | undefined,
  subscribe: Subscribe<T>,
  description: string,
): T | undefined {
  const [state, setState] = useState<{id: string; value: T}>();

  useEffect(() => {
    if (!id) return;
    return subscribe(
      id,
      (value) => setState({id, value}),
      (error) => console.error(`Unable to follow ${description}`, {error}),
    );
  }, [id, subscribe, description]);

  return state?.id === id ? state?.value : undefined;
}
