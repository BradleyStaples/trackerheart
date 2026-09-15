import Button from './Button';
import useDataStore from '../hooks/useDataStore';

interface Props {
  id?: string;
}

export default function Character({id}: Props) {
  const {getCharacter} = useDataStore();
  const character = id ? getCharacter(id) : undefined;

  const fieldClasses =
    'mbe-4 w-full border-1 border-gray-400 bg-white px-2 py-2 focus:ring-3 focus:outline-none ring-yellow-300 text-dh-purple';

  return (
    <>
      <form>
        <input type='hidden' name='id' value={id ?? ''} />
        <label>
          <span>Character name:</span>
          <input
            type='text'
            name='name'
            className={fieldClasses}
            defaultValue={character?.name ?? ''}
          />
        </label>
        <label>
          <span>Player name:</span>
          <input
            type='text'
            name='playerName'
            className={fieldClasses}
            defaultValue={character?.playerName ?? ''}
          />
        </label>
        <label>
          <span>Hope:</span>
          <input
            type='text'
            name='hope'
            className={fieldClasses}
            defaultValue={character?.hope ?? ''}
          />
        </label>
        <label>
          <span>Max Hope:</span>
          <input
            type='text'
            name='maxHope'
            className={fieldClasses}
            defaultValue={character?.maxHope ?? ''}
          />
        </label>
        <label>
          <span>Stress:</span>
          <input
            type='text'
            name='stress'
            className={fieldClasses}
            defaultValue={character?.stress ?? ''}
          />
        </label>
        <label>
          <span>Max Stress:</span>
          <input
            type='text'
            name='maxStress'
            className={fieldClasses}
            defaultValue={character?.maxStress ?? ''}
          />
        </label>
        <label>
          <span>Hit Points:</span>
          <input
            type='text'
            name='hitPoints'
            className={fieldClasses}
            defaultValue={character?.hitPoints ?? ''}
          />
        </label>
        <label>
          <span>Max Hit Points:</span>
          <input
            type='text'
            name='maxHitPoints'
            className={fieldClasses}
            defaultValue={character?.maxHitPoints ?? ''}
          />
        </label>
        <label>
          <span>Armor Slots:</span>
          <input
            type='text'
            name='armorSlots'
            className={fieldClasses}
            defaultValue={character?.armorSlots ?? ''}
          />
        </label>
        <label>
          <span>Max Armor Slots:</span>
          <input
            type='text'
            name='maxArmorSlots'
            className={fieldClasses}
            defaultValue={character?.maxArmorSlots ?? ''}
          />
        </label>
        <Button type='submit' label='Save' role='primary' />
      </form>
      <Button label='Back to Characters' role='secondary' link='/?tab=Player' />
    </>
  );
}
