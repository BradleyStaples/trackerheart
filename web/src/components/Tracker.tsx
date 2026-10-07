import Player from './Player';
import GameMaster from './GameMaster';

export default function Tracker() {
  return (
    <>
      <GameMaster />
      <div className='border-dh-teal mbs-10 mbe-2 w-full border-t-2' />
      <Player />
    </>
  );
}
