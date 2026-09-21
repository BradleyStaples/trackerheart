import {SyntheticEvent, useState, type FormEvent} from 'react';
import {useRouter} from 'next/router';
import Button from './Button';
import ResourceIconsManager from './ResourceIconsManager';
import ResourceIcons from './ResourceIcons';
import LeaveGame from './LeaveGame';
import useDataStore from '../hooks/useDataStore';
import type {Game, Character} from '../utils/types';

interface Props {
  game: Game | undefined;
  characters: Character[];
}

export default function Game({game, characters}: Props) {
  const router = useRouter();
  const {saveGame} = useDataStore();
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle',
  );

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // no fear radio is checked when the value is 0
    const fear = parseInt(String(formData.get('fear') ?? '0'), 10);

    setStatus('saving');
    try {
      const id = await saveGame({
        id: game?.id,
        name: String(formData.get('name') ?? '').trim(),
        gameMasterName: String(formData.get('gameMasterName') ?? '').trim(),
        fear,
      });
      if (game?.id) {
        // re-run getServerSideProps so the page shows the saved data
        await router.replace(router.asPath);
        setStatus('saved');
      } else {
        await router.push(`/games/${id}`);
      }
    } catch (error) {
      console.error('Unable to save Game', {error});
      setStatus('error');
    }
  };

  const fieldClasses =
    'mbe-2 w-full border-2 border-teal-400 rounded-sm bg-white px-2 py-1 focus:ring-3 focus:outline-none ring-yellow-300 text-dh-blue';

  return (
    <>
      <form className='mx-auto block w-[340]' onSubmit={handleSubmit}>
        <label>
          <span className='font-bold'>Game name:</span>
          <input
            type='text'
            name='name'
            required
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
        {game?.id && (
          <label>
            <span className='font-bold'>Share Code:</span>
            <input
              type='text'
              readOnly
              name='shareCode'
              className={fieldClasses}
              value={game?.shareCode.split('').join(' ') ?? ''}
            />
          </label>
        )}
        <ResourceIconsManager
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
        <Button
          className='ml-8'
          type='submit'
          label={status === 'saving' ? 'Saving...' : 'Save'}
          role='primary'
        />
        {status === 'saved' && <p role='status'>Saved.</p>}
        {status === 'error' && (
          <p role='alert'>Unable to save this Game. Please try again.</p>
        )}
      </form>
      <hr />
      <h3 className='mb-0 pb-0 text-xl font-semibold tracking-tight'>
        Characters in this game:
      </h3>
      <ul className='m-0 p-0'>
        {characters.length === 0 && (
          <li>There are no Characters in this Game.</li>
        )}
        {characters.map((character) => {
          return (
            <li key={character.id} className='mbe-4'>
              <h4 className='text-dh-gold mbe-4 text-lg'>
                <span className='pe-2 font-bold'>{character.name}</span>(
                {character.playerName})
              </h4>
              <ResourceIcons
                attribute='hope'
                label='Hope'
                value={character?.hope ?? 0}
                maxValue={6}
                maxLimit={6}
                icon='heart'
                readOnly
              />
              <ResourceIcons
                attribute='hitPoints'
                label='Hit Points'
                value={character?.hitPoints ?? 0}
                maxValue={character?.maxHitPoints ?? 0}
                maxLimit={12}
                icon='cross'
                readOnly
              />
              <ResourceIcons
                attribute='stress'
                label='Stress'
                value={character?.stress ?? 0}
                maxValue={character?.maxStress ?? 0}
                maxLimit={12}
                icon='star'
                readOnly
              />
              <ResourceIcons
                attribute='armorSlots'
                label='Armor Slots'
                value={character?.armorSlots ?? 0}
                maxValue={character?.maxArmorSlots ?? 0}
                maxLimit={12}
                icon='shield'
                readOnly
              />
              {game?.id && (
                <LeaveGame
                  characterId={character.id}
                  gameId={game.id}
                  label='Remove from Game'
                  confirmMessage={`Remove ${character.name} from ${game.name}?`}
                />
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
