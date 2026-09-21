import Button from './Button';
import ResourceIconsManager from './ResourceIconsManager';
import ResourceIcons from './ResourceIcons';
import type {Character, Game} from '../utils/types';

interface Props {
  character: Character | undefined;
  game: Game | undefined;
}

export default function Character({character, game}: Props) {
  const fieldClasses =
    'mbe-4 w-full border-2 border-gray-700 rounded-sm bg-white px-2 py-1 focus:ring-3 focus:outline-none ring-yellow-300 text-dh-blue';

  return (
    <>
      <form className='mx-auto block w-[340]'>
        <input type='hidden' name='id' value={character?.id ?? ''} />
        <label>
          <span className='font-bold'>Character name:</span>
          <input
            type='text'
            name='name'
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
        <Button
          label='Back to Characters'
          role='secondary'
          link='/?tab=Player'
        />
        <Button type='submit' label='Save' role='primary' className='ml-8' />
      </form>
      <hr />
      {game && (
        <>
          <h3 className='text-dh-gold mb-0 pb-0 text-xl font-semibold tracking-tight'>
            This character is playing in:
            <br />
            <span className='font-bold'>{game.name}</span> (
            {game.gameMasterName})
          </h3>
          <ResourceIcons
            attribute='fear'
            label='Fear'
            value={game?.fear ?? 0}
            maxValue={12}
            maxLimit={12}
            icon='skull'
            readOnly
          />
        </>
      )}
    </>
  );
}
