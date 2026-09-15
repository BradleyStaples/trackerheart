import Button from './Button';
import useDataStore from '../hooks/useDataStore';

export default function Player() {
  const {getCharacters} = useDataStore();
  const characters = getCharacters();

  return (
    <>
      <h3 className='text-dh-gold mb-0 pb-0 text-xl font-semibold tracking-tight'>
        Your Characters:
      </h3>
      <ul className='m-0 p-0'>
        {characters.length === 0 && <li>You do not have any Characters.</li>}
        {characters.map((character) => {
          return (
            <li key={character.id} className='py-2'>
              <span className='text-lg'>{character.name}</span>
              <br />
              <Button
                label='View Character'
                role='primary'
                link={`/characters/${character.id}`}
              />
            </li>
          );
        })}
      </ul>
      <Button
        label='Add New Character'
        role='secondary'
        link='/new-character'
      />
    </>
  );
}
