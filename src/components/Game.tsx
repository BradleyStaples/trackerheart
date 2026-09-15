import Button from './Button';
import useDataStore from '../hooks/useDataStore';

interface Props {
  id?: string;
}

export default function Game({id}: Props) {
  const {getGame} = useDataStore();
  const game = id ? getGame(id) : undefined;

  const fieldClasses =
    'mbe-4 w-full border-1 border-gray-400 bg-white px-2 py-2 focus:ring-3 focus:outline-none ring-yellow-300 text-dh-purple';

  return (
    <>
      <form>
        <input type='hidden' name='id' value={id ?? ''} />
        <label>
          <span>Game name:</span>
          <input
            type='text'
            name='name'
            className={fieldClasses}
            defaultValue={game?.name ?? ''}
          />
        </label>
        <label>
          <span>GameMaster name:</span>
          <input
            type='text'
            name='gameMasterName'
            className={fieldClasses}
            defaultValue={game?.gameMasterName ?? ''}
          />
        </label>
        <label>
          <span>Share Code:</span>
          <input
            type='text'
            readOnly
            name='shareCode'
            className={fieldClasses}
            value={game?.shareCode ?? ''}
          />
        </label>
        <label>
          <span>Character Ids:</span>
          <input
            type='text'
            readOnly
            name='characterIds'
            className={fieldClasses}
            value={game?.characterIds.join(', ') ?? ''}
          />
        </label>
        <label>
          <span>Fear:</span>
          <input
            type='text'
            name='fear'
            className={fieldClasses}
            defaultValue={game?.fear ?? ''}
          />
        </label>
        <Button type='submit' label='Save' role='primary' />
      </form>
      <Button label='Back to Games' role='secondary' link='/?tab=GameMaster' />
    </>
  );
}
