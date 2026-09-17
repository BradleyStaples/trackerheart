import Button from './Button';
import ResourceIcons from './ResourceIcons';
import useDataStore from '../hooks/useDataStore';

interface Props {
  id?: string;
}

export default function Character({id}: Props) {
  const {getCharacter} = useDataStore();
  const character = id ? getCharacter(id) : undefined;

  const fieldClasses =
    'mbe-4 w-full border-1 border-gray-400 bg-white px-2 py-2 focus:ring-3 focus:outline-none ring-yellow-300 text-dh-blue';

  return (
    <>
      <form className='mx-auto block w-[340]'>
        <input type='hidden' name='id' value={id ?? ''} />
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
        <ResourceIcons
          attribute='hope'
          label='Hope'
          value={character?.hope ?? 0}
          maxValue={6}
          maxLimit={6}
          icon='heart'
        />
        <ResourceIcons
          attribute='hitPoints'
          label='Hit Points'
          value={character?.hitPoints ?? 0}
          maxValue={character?.maxHitPoints ?? 0}
          maxLimit={12}
          showMaxDropdown
          icon='cross'
        />
        <ResourceIcons
          attribute='stress'
          label='Stress'
          value={character?.stress ?? 0}
          maxValue={character?.maxStress ?? 0}
          maxLimit={12}
          showMaxDropdown
          icon='siren'
        />
        <ResourceIcons
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
    </>
  );
}
