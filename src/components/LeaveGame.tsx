import {useState} from 'react';
import ConfirmModal from './ConfirmModal';
import useDataStore from '../hooks/useDataStore';

interface Props {
  characterId: string;
  label: string;
  confirmMessage: string;
  className?: string;
}

export default function LeaveGame({
  characterId,
  label,
  confirmMessage,
  className,
}: Props) {
  const {leaveGame} = useDataStore();
  const [status, setStatus] = useState<'idle' | 'leaving' | 'error'>('idle');

  const handleClick = async () => {
    setStatus('leaving');
    try {
      await leaveGame(characterId);
      // the page follows the Game in real time, so it updates without a refresh
      setStatus('idle');
    } catch (error) {
      console.error('Unable to leave Game', {error});
      setStatus('error');
    }
  };

  return (
    <div className={className}>
      <ConfirmModal
        buttonLabel={status === 'leaving' ? 'Removing...' : label}
        buttonVariant='tertiary'
        buttonSize='small'
        message={confirmMessage}
        onConfirm={handleClick}
      />
      {status === 'error' && (
        <p role='alert'>Unable to remove this Character. Please try again.</p>
      )}
    </div>
  );
}
