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
    <footer className='bg-dh-purple fixed bottom-0 left-0 z-20 w-full border-t p-4 shadow-sm md:p-6'>
      <div className='mx-auto flex w-3xs items-center justify-between self-center p-2'>
        <div className='w-16 grow-0 text-right text-xl font-semibold'>
          Game Master
        </div>
        <label className='relative flex w-20 cursor-pointer items-center justify-between p-2 text-xl'>
          <input
            type='checkbox'
            className='peer absolute left-1/2 h-[85%] w-[85%] -translate-x-1/2 appearance-none rounded-full focus:ring-2 focus:outline-none'
            onChange={handlePlayerType}
            checked={isPlayer}
          />
          <span className='flex h-10 w-16 shrink-0 items-center rounded-full bg-teal-200 p-1 duration-300 ease-in-out peer-checked:bg-yellow-300 before:cursor-pointer after:h-8 after:w-8 after:cursor-pointer after:rounded-full after:bg-blue-500 after:shadow-md after:duration-300 group-hover:after:translate-x-1 peer-checked:after:translate-x-6'></span>
        </label>
        <div className='w-16 grow-0 text-xl font-semibold'>Player</div>
      </div>
    </footer>
  );
}
