import {useState, type SyntheticEvent} from 'react';
import Button from './Button';
import useDataStore from '../hooks/useDataStore';

interface Props {
  characterId: string;
}

export default function JoinGame({characterId}: Props) {
  const {joinGame} = useDataStore();
  const [status, setStatus] = useState<
    'idle' | 'joining' | 'notFound' | 'error'
  >('idle');

  const fieldClasses =
    'mbe-4 w-full border-2 border-gray-700 rounded-sm bg-white px-2 py-1 uppercase tracking-widest focus:ring-3 focus:outline-none ring-yellow-300 text-dh-blue';

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const shareCode = String(formData.get('shareCode') ?? '');

    setStatus('joining');
    try {
      const game = await joinGame(characterId, shareCode);
      if (!game) {
        setStatus('notFound');
        return;
      }
      // the page follows the Character's Game in real time, so it switches
      // from this form to the Game without a refresh
    } catch (error) {
      console.error('Unable to join Game', {error});
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className='text-dh-gold mb-0 pb-0 text-xl font-semibold'>
        Join a Game
      </h3>
      <label>
        <span className='font-bold'>Invite Code:</span>
        <input
          type='text'
          name='shareCode'
          autoComplete='off'
          required
          className={fieldClasses}
        />
      </label>
      <Button
        type='submit'
        label={status === 'joining' ? 'Joining...' : 'Join Game'}
        variant='primary'
        size='large'
      />
      {status === 'notFound' && (
        <p role='alert'>No Game found with that Share Code.</p>
      )}
      {status === 'error' && (
        <p role='alert'>Unable to join this Game. Please try again.</p>
      )}
    </form>
  );
}
