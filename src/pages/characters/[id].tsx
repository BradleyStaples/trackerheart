import {useRouter} from 'next/router';
import Character from '../../components/Character';
import Button from '../../components/Button';
import Wrapper from '../../components/Wrapper';
import useCharacter from '../../hooks/useCharacter';

// Loaded in the browser rather than with getServerSideProps, since security
// rules need the user's Firebase Auth sign-in, which only the browser has.
export default function CharacterPage() {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : undefined;
  const character = useCharacter(id);

  return (
    <Wrapper>
      {character === undefined && <p className='text-center'>Loading...</p>}
      {character === null && (
        <>
          <p className='mbe-4 text-center'>Character not found.</p>
          <Button label='Home' variant='secondary' link='/' size='full' />
        </>
      )}
      {character && <Character key={character.id} character={character} />}
    </Wrapper>
  );
}
