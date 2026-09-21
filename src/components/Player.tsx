import Button from './Button';
import useDataStore from '../hooks/useDataStore';
import type {Character} from '../utils/types';
import {useEffect, useState} from 'react';

export default function Player() {
  const {getCharacters} = useDataStore();
  const [characters, setCharacters] = useState<Character[]>([]);

  // Runs once on mount: useDataStore returns new function instances every
  // render, so listing getGames as a dependency would refetch in a loop.
  useEffect(() => {
    let cancelled = false;
    getCharacters().then((fetchedCharacters) => {
      if (!cancelled) setCharacters(fetchedCharacters);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h3 className='text-dh-gold mb-0 pb-0 text-xl font-semibold tracking-tight'>
        Your Characters:
      </h3>
      <ul className='m-0 p-0'>
        {characters.length === 0 && <li>You do not have any Characters.</li>}
        {characters.map((character) => {
          return (
            <li key={character.id} className='py-2'>
              <Button
                label={character.name}
                role='primary'
                link={`/characters/${character.id}`}
                className='mbe-1 inline-block text-lg'
              />
            </li>
          );
        })}
      </ul>
      <Button
        label='Add New Character'
        role='tertiary'
        link='/characters/new'
      />
    </>
  );
}
