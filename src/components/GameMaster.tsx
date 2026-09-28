import {useEffect, useState} from 'react';
import Button from './Button';
import useDataStore from '../hooks/useDataStore';
import type {Game} from '../utils/types';

export default function GameMaster() {
  const {getGames} = useDataStore();
  const [games, setGames] = useState<Game[]>([]);

  // Runs once on mount: useDataStore returns new function instances every
  // render, so listing getGames as a dependency would refetch in a loop.
  useEffect(() => {
    let cancelled = false;
    getGames().then((fetchedGames) => {
      if (!cancelled) setGames(fetchedGames);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h3 className='text-dh-gold pb-4 text-xl font-semibold'>
        As GM, Your Games:
      </h3>
      <ul>
        {games === undefined && <li>Loading...</li>}
        {games.length === 0 && <li>You do not have any Games.</li>}
        {games.map((game) => {
          return (
            <li key={game.id} className='pb-4'>
              <Button
                label={game.name}
                variant='primary'
                size='large'
                link={`/games/${game.id}`}
                className='text-lg'
              />
            </li>
          );
        })}
      </ul>
      <Button
        label='Add New Game'
        variant='tertiary'
        size='small'
        link='/games/new'
      />
    </>
  );
}
