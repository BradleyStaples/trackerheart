import {useState} from 'react';
import {useSearchParams} from 'next/navigation';

import PlayerTypeToggle from './PlayerTypeToggle';
import Player from './Player';
import GameMaster from './GameMaster';
import type {PlayerType} from '../utils/types';

export default function Tracker() {
  const [usedTabData, setUsedTabData] = useState(false);
  const params = useSearchParams();
  const tab = params?.get('tab');
  const initialPlayerType: PlayerType = tab ? (tab as PlayerType) : 'Player';
  const [playerType, setPlayerType] = useState<PlayerType>(initialPlayerType);
  const isPlayer = playerType === 'Player';

  const handlePlayerTypeChange = (newPlayerType: PlayerType) => {
    setUsedTabData(true);
    setPlayerType(newPlayerType);
  };

  if (tab && tab !== playerType && usedTabData === false) {
    handlePlayerTypeChange(tab as PlayerType);
  }

  return (
    <>
      {isPlayer ? <Player /> : <GameMaster />}
      <PlayerTypeToggle
        playerType={playerType}
        setPlayerType={handlePlayerTypeChange}
      />
    </>
  );
}
