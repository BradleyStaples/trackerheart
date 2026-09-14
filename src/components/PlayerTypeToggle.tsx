import {ChangeEvent, Dispatch, SetStateAction} from 'react';
import type {PlayerType} from '../utils/types';

interface Props {
  playerType: PlayerType;
  setPlayerType: Dispatch<SetStateAction<PlayerType>>;
}

export default function PlayerTypeToggle({playerType, setPlayerType}: Props) {
  const isPlayer = playerType === 'Player';

  const handlePlayerType = (event: ChangeEvent<HTMLInputElement>) => {
    const newPlayerType = event.target.checked;
    setPlayerType(newPlayerType ? 'Player' : 'GameMaster');
  };

  return (
    <div className='flex items-center justify-between self-center p-2'>
      <div className='w-16 grow-0 text-right text-xl font-semibold'>
        Game Master
      </div>
      <label className='relative flex w-20 cursor-pointer items-center justify-between p-2 text-xl'>
        <input
          type='checkbox'
          className='peer absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md'
          onChange={handlePlayerType}
          checked={isPlayer}
        />
        <span className='flex h-10 w-16 shrink-0 items-center rounded-full bg-teal-200 p-1 duration-300 ease-in-out peer-checked:bg-yellow-300 before:cursor-pointer after:h-8 after:w-8 after:cursor-pointer after:rounded-full after:bg-blue-500 after:shadow-md after:duration-300 group-hover:after:translate-x-1 peer-checked:after:translate-x-6'></span>
      </label>
      <div className='w-16 grow-0 text-xl font-semibold'>Player</div>
    </div>
  );
}
