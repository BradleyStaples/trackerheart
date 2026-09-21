import {useState} from 'react';
import {useRouter} from 'next/router';
import Button from './Button';
import useDataStore from '../hooks/useDataStore';

interface Props {
  characterId: string;
  gameId: string;
  label: string;
  confirmMessage: string;
  className?: string;
}

export default function LeaveGame({
  characterId,
  gameId,
  label,
  confirmMessage,
  className,
}: Props) {
  const router = useRouter();
  const {leaveGame} = useDataStore();
  const [status, setStatus] = useState<'idle' | 'leaving' | 'error'>('idle');

  const handleClick = async () => {
    if (!window.confirm(confirmMessage)) return;

    setStatus('leaving');
    try {
      await leaveGame(characterId, gameId);
      // re-run getServerSideProps so the page no longer shows the Game
      await router.replace(router.asPath);
      setStatus('idle');
    } catch (error) {
      console.error('Unable to leave Game', {error});
      setStatus('error');
    }
  };

  return (
    <>
      <Button
        label={status === 'leaving' ? 'Removing...' : label}
        role='tertiary'
        className={className}
        onClick={handleClick}
      />
      {status === 'error' && (
        <p role='alert'>Unable to remove this Character. Please try again.</p>
      )}
    </>
  );
}
