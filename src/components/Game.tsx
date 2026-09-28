import {SyntheticEvent, useState} from 'react';
import {useRouter} from 'next/router';
import Button from './Button';
import ResourceIconsManager from './ResourceIconsManager';
import ResourceIcons from './ResourceIcons';
import LeaveGame from './LeaveGame';
import useDataStore from '../hooks/useDataStore';
import useCharactersInGame from '../hooks/useCharactersInGame';
import type {Game, Character} from '../utils/types';
import ConfirmModal from './ConfirmModal';

interface Props {
  game: Game | undefined;
  characters: Character[];
}

export default function Game({game, characters: initialCharacters}: Props) {
  const characters = useCharactersInGame(game?.id, initialCharacters);
  const router = useRouter();
  const {saveGame, deleteGame} = useDataStore();
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [deleteStatus, setDeleteStatus] = useState<
    'idle' | 'deleting' | 'error'
  >('idle');

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // no fear radio is checked when the value is 0
    const fear = parseInt(String(formData.get('fear') ?? '0'), 10);

    setSaveStatus('saving');
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
        setSaveStatus('saved');
      } else {
        await router.push(`/games/${id}`);
      }
    } catch (error) {
      console.error('Unable to save Game', {error});
      setSaveStatus('error');
    }
  };

  const handleDelete = async () => {
    if (!game?.id) return;
    setDeleteStatus('deleting');
    try {
      await deleteGame(game.id);
      await router.push('/?tab=GameMaster');
    } catch (error) {
      console.error('Unable to delete Game', {error});
      setDeleteStatus('error');
    }
  };

  const fieldClasses =
    'mbe-2 w-full border-2 border-teal-400 rounded-sm bg-white px-2 py-1 focus:ring-3 focus:outline-none ring-yellow-300 text-dh-blue';

  return (
    <>
      <form className='mx-auto w-68' onSubmit={handleSubmit}>
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
          <span className='font-bold'>GM name:</span>
          <input
            type='text'
            name='gameMasterName'
            className={fieldClasses}
            defaultValue={game?.gameMasterName ?? ''}
          />
        </label>
        {game?.id && (
          <label>
            <span className='font-bold'>Invite Code:</span>
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
        <div className='mt-8 flex justify-between'>
          {game?.id && (
            <ConfirmModal
              buttonLabel={
                deleteStatus === 'deleting' ? 'Deleting...' : 'Delete'
              }
              message={`Are you sure you want to delete ${game.name}? This cannot be undone.`}
              onConfirm={handleDelete}
            />
          )}
          <Button
            type='submit'
            label={saveStatus === 'saving' ? 'Saving...' : 'Save'}
            variant='primary'
            size='large'
          />
        </div>
        <div className='text-center'>
          {saveStatus === 'saved' && <p role='status'>Saved.</p>}
          {saveStatus === 'error' && (
            <p role='alert'>Unable to save this Game. Please try again.</p>
          )}
          {deleteStatus === 'error' && (
            <p role='alert'>Unable to delete this Game. Please try again.</p>
          )}
        </div>
        <div className='flex justify-center text-center'>
          <Button
            label='Back to All Games'
            variant='secondary'
            link='/?tab=GameMaster'
            className='mt-4'
          />
        </div>
      </form>
      {characters.length > 0 && (
        <>
          <div className='border-dh-teal my-4 w-full border-t-2' />
          <h3 className='mbs-2 mbe-2 text-center text-xl font-semibold tracking-tight'>
            Characters in game: {characters.length}
          </h3>
        </>
      )}
      {characters.length > 0 && (
        <ul>
          {characters.map((character, index) => {
            const liClasses =
              index === 0
                ? 'mbe-4 w-full'
                : 'mbe-4 w-full border-t-2 border-dh-teal pt-4';

            return (
              <li key={character.id} className={liClasses}>
                <h4 className='text-dh-gold mbe-4 text-center text-lg'>
                  <span className='pe-2 font-bold'>{character.name}</span>(
                  {character.playerName})
                </h4>
                <div className='mx-auto w-48'>
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
                      className='mbs-2 block w-full text-center'
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
