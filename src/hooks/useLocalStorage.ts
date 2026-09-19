'use client';

import {useState} from 'react';

type HookReturn<T> = [T, (value: T) => void];

export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
): HookReturn<T> {
  const [state, setState] = useState<T>(() => {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    } catch (error) {
      console.error(error);
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setState(value);
    } catch (error) {
      console.error(error);
    }
  };

  return [state, setValue];
}
