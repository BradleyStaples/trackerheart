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
      <h3 className='text-dh-gold mt-12 pb-4 text-xl font-semibold'>
        As a Player, Your Characters:
      </h3>
      <ul>
        {characters.length === 0 && (
          <li className='pb-4'>You do not have any Characters.</li>
        )}
        {characters.map((character) => {
          return (
            <li key={character.id} className='pb-4'>
              <Button
                label={character.name}
                variant='primary'
                size='large'
                link={`/characters/${character.id}`}
                className='text-lg'
              />
            </li>
          );
        })}
      </ul>
      <Button
        label='Add New Character'
        variant='tertiary'
        size='small'
        link='/characters/new'
      />
    </>
  );
}
