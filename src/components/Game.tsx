import Button from './Button';
import ResourceIcons from './ResourceIcons';
import useDataStore from '../hooks/useDataStore';
import {createShareCode} from '../utils/utils';

interface Props {
  id?: string;
}

export default function Game({id}: Props) {
  const {getGame} = useDataStore();
  const game = id ? getGame(id) : undefined;
  const initialShareCode = createShareCode();

  const fieldClasses =
    'mbe-2 w-full border-2 border-teal-400 rounded-sm bg-white px-2 py-1 focus:ring-3 focus:outline-none ring-yellow-300 text-dh-blue';

  return (
    <>
      <form className='mx-auto block w-[340]'>
        <input type='hidden' name='id' value={id ?? ''} />
        {!id && (
          <input type='hidden' name='shareCode' value={initialShareCode} />
        )}
        <label>
          <span className='font-bold'>Game name:</span>
          <input
            type='text'
            name='name'
            className={fieldClasses}
            defaultValue={game?.name ?? ''}
          />
        </label>
        <label>
          <span className='font-bold'>GameMaster name:</span>
          <input
            type='text'
            name='gameMasterName'
            className={fieldClasses}
            defaultValue={game?.gameMasterName ?? ''}
          />
        </label>
        {id && (
          <label>
            <span className='font-bold'>Share Code:</span>
            <input
              type='text'
              readOnly
              name='shareCode'
              className={fieldClasses}
              value={game?.shareCode ?? ''}
            />
          </label>
        )}
        <label>
          <span className='font-bold'>Character Ids:</span>
          <input
            type='text'
            readOnly
            name='characterIds'
            className={fieldClasses}
            value={game?.characterIds.join(', ') ?? ''}
          />
        </label>
        <ResourceIcons
          attribute='fear'
          label='Fear'
          value={game?.fear ?? 0}
          maxValue={12}
          maxLimit={12}
          icon='skull'
        />
        <Button
          label='Back to Games'
          role='secondary'
          link='/?tab=GameMaster'
        />
        <Button className='ml-8' type='submit' label='Save' role='primary' />
      </form>
    </>
  );
}
