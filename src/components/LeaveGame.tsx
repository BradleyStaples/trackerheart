import {useState} from 'react';
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
  const {leaveGame} = useDataStore();
  const [status, setStatus] = useState<'idle' | 'leaving' | 'error'>('idle');

  const handleClick = async () => {
    if (!window.confirm(confirmMessage)) return;

    setStatus('leaving');
    try {
      await leaveGame(characterId, gameId);
      // the page follows the Game in real time, so it updates without a refresh
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
