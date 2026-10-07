import {SyntheticEvent, useState} from 'react';
import {useRouter} from 'next/router';
import Button from './Button';
import ResourceIconsManager from './ResourceIconsManager';
import ResourceIcons from './ResourceIcons';
import LeaveGame from './LeaveGame';
import useDataStore from '../hooks/useDataStore';
import useSavedQueryFlag, {SAVED_QUERY_PARAM} from '../hooks/useSavedQueryFlag';
import useCharactersInGame from '../hooks/useCharactersInGame';
import type {Game, Character} from '../utils/types';
import ConfirmModal from './ConfirmModal';
import Toast from './Toast';

interface Props {
  game: Game | undefined;
  characters: Character[];
}

export default function Game({game, characters: initialCharacters}: Props) {
  const characters = useCharactersInGame(game?.id, initialCharacters);
  const router = useRouter();
  const {saveGame, deleteGame} = useDataStore();
  const savedOnCreate = useSavedQueryFlag();
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >(savedOnCreate ? 'saved' : 'idle');
  const [deleteStatus, setDeleteStatus] = useState<
    'idle' | 'deleting' | 'error'
  >('idle');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  );

  const handleCopy = async () => {
    if (!game?.shareCode) return;
    try {
      await navigator.clipboard.writeText(game.shareCode);
      setCopyStatus('copied');
    } catch (error) {
      console.error('Unable to copy Invite Code', {error});
      setCopyStatus('error');
    }
  };

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
        await router.push(`/games/${id}?${SAVED_QUERY_PARAM}=1`);
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
            <div className='relative'>
              <input
                type='text'
                readOnly
                name='shareCode'
                className={`${fieldClasses} pe-16`}
                value={game?.shareCode.split('').join(' ') ?? ''}
              />
              {/* mbe-2 matches the input's margin so the button spans only the field */}
              <button
                type='button'
                onClick={handleCopy}
                style={{anchorName: '--copy-button-anchor'}}
                className='text-dh-purple absolute inset-e-0.5 top-0.5 bottom-0.5 mbe-2 cursor-pointer rounded-xs bg-linear-to-r from-teal-300 via-teal-400 to-teal-500 px-2 text-sm font-bold ring-yellow-300 hover:bg-linear-to-br hover:text-teal-900 focus:ring-3 focus:outline-none active:text-teal-900'
              >
                Copy
              </button>
            </div>
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
        <div className='relative mt-8 h-12'>
          <div className='absolute left-[-24] grid w-80 grid-cols-3 gap-4'>
            <Button label='Home' variant='secondary' link='/' size='full' />
            <div>
              {game?.id && (
                <ConfirmModal
                  buttonLabel={
                    deleteStatus === 'deleting' ? 'Deleting...' : 'Delete'
                  }
                  buttonStyle={{anchorName: '--delete-button-anchor'}}
                  message={`Are you sure you want to delete ${game.name}? This cannot be undone.`}
                  onConfirm={handleDelete}
                  buttonSize='full'
                />
              )}
            </div>
            <Button
              style={{anchorName: '--save-button-anchor'}}
              type='submit'
              label={saveStatus === 'saving' ? 'Saving...' : 'Save'}
              variant='primary'
              size='full'
            />
          </div>
        </div>
        <div className='text-center'>
          <Toast
            message='Game saved.'
            show={saveStatus === 'saved'}
            anchorName='--save-button-anchor'
            tone='success'
          />
          <Toast
            message='Error saving, please try again.'
            show={saveStatus === 'error'}
            anchorName='--save-button-anchor'
            tone='error'
          />
          <Toast
            message='Error deleting, please try again.'
            show={deleteStatus === 'error'}
            anchorName='--delete-button-anchor'
            tone='error'
          />
          <Toast
            message='Invite Code copied.'
            show={copyStatus === 'copied'}
            onHide={() => setCopyStatus('idle')}
            anchorName='--copy-button-anchor'
            tone='info'
          />
          <Toast
            message='Unable to copy, please try again.'
            show={copyStatus === 'error'}
            onHide={() => setCopyStatus('idle')}
            anchorName='--copy-button-anchor'
            tone='error'
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
