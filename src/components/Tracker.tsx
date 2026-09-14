import {useState} from 'react';

import PlayerTypeToggle from './PlayerTypeToggle';
import Player from './Player';
import GameMaster from './GameMaster';
import type {PlayerType} from '../utils/types';

export default function Tracker() {
  const initialPlayerType: PlayerType = 'Player';
  const [playerType, setPlayerType] = useState<PlayerType>(initialPlayerType);
  const isPlayer = playerType === 'Player';

  return (
    <>
      {isPlayer ? <Player /> : <GameMaster />}
      <PlayerTypeToggle playerType={playerType} setPlayerType={setPlayerType} />
    </>
  );
}
