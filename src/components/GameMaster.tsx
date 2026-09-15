import Button from './Button';
import useDataStore from '../hooks/useDataStore';

export default function GameMaster() {
  const {getGames} = useDataStore();
  const games = getGames();

  return (
    <>
      <h3 className='text-dh-gold mb-0 pb-0 text-xl font-semibold tracking-tight'>
        Your Games:
      </h3>
      <ul>
        {games.length === 0 && <li>You do not have any Games.</li>}
        {games.map((game) => {
          return (
            <li key={game.id} className='py-2'>
              <span className='text-lg'>{game.name}</span>
              <br />
              <Button
                label='View Game'
                role='primary'
                link={`/games/${game.id}`}
              />
            </li>
          );
        })}
      </ul>
      <Button label='Add New Game' role='secondary' link='/new-game' />
    </>
  );
}
