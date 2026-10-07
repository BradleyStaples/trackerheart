import {useRouter} from 'next/router';
import Game from '../../components/Game';
import Button from '../../components/Button';
import Wrapper from '../../components/Wrapper';
import useGame from '../../hooks/useGame';

// Loaded in the browser rather than with getServerSideProps, since security
// rules need the user's Firebase Auth sign-in, which only the browser has.
export default function GamePage() {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : undefined;
  const game = useGame(id);

  return (
    <Wrapper>
      {game === undefined && <p className='text-center'>Loading...</p>}
      {game === null && (
        <>
          <p className='mbe-4 text-center'>Game not found.</p>
          <Button label='Home' variant='secondary' link='/' size='full' />
        </>
      )}
      {game && <Game key={game.id} game={game} />}
    </Wrapper>
  );
}
