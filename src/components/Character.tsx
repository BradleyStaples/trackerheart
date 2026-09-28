import {useState, type SyntheticEvent} from 'react';
import {useRouter} from 'next/router';
import Button from './Button';
import JoinGame from './JoinGame';
import LeaveGame from './LeaveGame';
import ResourceIconsManager from './ResourceIconsManager';
import ResourceIcons from './ResourceIcons';
import useDataStore from '../hooks/useDataStore';
import useGameForCharacter from '../hooks/useGameForCharacter';
import type {Character, Game} from '../utils/types';
import ConfirmModal from './ConfirmModal';
import Toast from './Toast';

interface Props {
  character: Character | undefined;
  game: Game | undefined;
}

export default function Character({character, game: initialGame}: Props) {
  const game = useGameForCharacter(character?.id, initialGame);
  const router = useRouter();
  const {saveCharacter, deleteCharacter} = useDataStore();
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [deleteStatus, setDeleteStatus] = useState<
    'idle' | 'deleting' | 'error'
  >('idle');

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // no radio is checked when a resource's value is 0
    const getNumber = (field: string) =>
      parseInt(String(formData.get(field) ?? '0'), 10) || 0;

    setSaveStatus('saving');
    try {
      const id = await saveCharacter({
        id: character?.id,
        name: String(formData.get('name') ?? '').trim(),
        playerName: String(formData.get('playerName') ?? '').trim(),
        hope: getNumber('hope'),
        hitPoints: getNumber('hitPoints'),
        maxHitPoints: getNumber('hitPointsMaxValue'),
        stress: getNumber('stress'),
        maxStress: getNumber('stressMaxValue'),
        armorSlots: getNumber('armorSlots'),
        maxArmorSlots: getNumber('armorSlotsMaxValue'),
      });
      if (character?.id) {
        // re-run getServerSideProps so the page shows the saved data
        await router.replace(router.asPath);
        setSaveStatus('saved');
      } else {
        await router.push(`/characters/${id}`);
      }
    } catch (error) {
      console.error('Unable to save Character', {error});
      setSaveStatus('error');
    }
  };

  const handleDelete = async () => {
    if (!character?.id) return;
    setDeleteStatus('deleting');
    try {
      await deleteCharacter(character.id);
      await router.push('/?tab=Player');
    } catch (error) {
      console.error('Unable to delete Character', {error});
      setDeleteStatus('error');
    }
  };

  const fieldClasses =
    'mbe-4 w-full border-2 border-gray-700 rounded-sm bg-white px-2 py-1 focus:ring-3 focus:outline-none ring-dh-gold text-dh-blue';

  return (
    <>
      <form className='mx-auto w-68' onSubmit={handleSubmit}>
        <label>
          <span className='font-bold'>Character name:</span>
          <input
            type='text'
            name='name'
            required
            autoComplete='off'
            className={fieldClasses}
            defaultValue={character?.name ?? ''}
          />
        </label>
        <label>
          <span className='font-bold'>Player name:</span>
          <input
            type='text'
            name='playerName'
            autoComplete='off'
            className={fieldClasses}
            defaultValue={character?.playerName ?? ''}
          />
        </label>
        <ResourceIconsManager
          attribute='hope'
          label='Hope'
          value={character?.hope ?? 0}
          maxValue={6}
          maxLimit={6}
          icon='heart'
        />
        <ResourceIconsManager
          attribute='hitPoints'
          label='Hit Points'
          value={character?.hitPoints ?? 0}
          maxValue={character?.maxHitPoints ?? 0}
          maxLimit={12}
          showMaxDropdown
          icon='cross'
        />
        <ResourceIconsManager
          attribute='stress'
          label='Stress'
          value={character?.stress ?? 0}
          maxValue={character?.maxStress ?? 0}
          maxLimit={12}
          showMaxDropdown
          icon='star'
        />
        <ResourceIconsManager
          attribute='armorSlots'
          label='Armor Slots'
          value={character?.armorSlots ?? 0}
          maxValue={character?.maxArmorSlots ?? 0}
          maxLimit={12}
          showMaxDropdown
          icon='shield'
        />
        <div className='mt-8 flex justify-between'>
          {character?.id && (
            <ConfirmModal
              buttonLabel={
                deleteStatus === 'deleting' ? 'Deleting...' : 'Delete'
              }
              buttonStyle={{anchorName: '--delete-button-anchor'}}
              message={`Are you sure you want to delete ${character.name}? This cannot be undone.`}
              onConfirm={handleDelete}
            />
          )}
          <Button
            style={{anchorName: '--save-button-anchor'}}
            type='submit'
            label={saveStatus === 'saving' ? 'Saving...' : 'Save'}
            variant='primary'
            size='large'
          />
        </div>
        <div className='text-center'>
          <Toast
            message='Character saved.'
            show={saveStatus === 'saved'}
            anchorName='--save-button-anchor'
          />
          <Toast
            message='Error saving, please try again.'
            show={saveStatus === 'error'}
            anchorName='--save-button-anchor'
          />
          <Toast
            message='Error deleting, please try again.'
            show={deleteStatus === 'error'}
            anchorName='--save-button-anchor'
          />
        </div>
        <div className='flex justify-center text-center'>
          <Button label='Home' variant='secondary' link='/' className='mt-4' />
        </div>
      </form>
      <div className='border-dh-teal my-4 w-full border-t-2' />
      {game && (
        <h3 className='text-dh-teal mbe-4 text-center text-xl font-semibold tracking-tight'>
          This character is part of{' '}
          <span className='text-dh-gold font-bold'>{game.name}</span> by{' '}
          {game.gameMasterName}
        </h3>
      )}
      <div className='mx-auto w-48'>
        {game && (
          <ResourceIcons
            attribute='fear'
            label='Fear'
            value={game?.fear ?? 0}
            maxValue={12}
            maxLimit={12}
            icon='skull'
            readOnly
          />
        )}
        {game && character?.id && (
          <LeaveGame
            characterId={character.id}
            gameId={game.id}
            label='Leave Game'
            confirmMessage={`Leave ${game.name}?`}
            className='mx-auto mt-6 block w-32 text-center'
          />
        )}
        {!game && character?.id && <JoinGame characterId={character.id} />}
      </div>
    </>
  );
}
