export type PlayerType = 'Player' | 'GameMaster';

export interface Character {
  id?: string;
  name: string;
  playerName: string;
  hope: number;
  maxHope: number;
  stress: number;
  maxStress: number;
  hitPoints: number;
  maxHitPoints: number;
  armorSlots: number;
  maxArmorSlots: number;
}

export interface Game {
  id?: string;
  name: string;
  gameMasterName: string;
  fear: number;
  shareCode: string;
  characterIds: string[];
}
