import type {Game, Character} from './types';

const characters: Character[] = [
  {
    id: '123abc',
    name: 'Juniper Tillbury',
    playerName: 'Tracy',
    hope: 2,
    stress: 0,
    maxStress: 4,
    hitPoints: 1,
    maxHitPoints: 5,
    armorSlots: 1,
    maxArmorSlots: 3,
  },
  {
    id: '456def',
    name: 'Commodore',
    playerName: 'Michael',
    hope: 3,
    stress: 1,
    maxStress: 5,
    hitPoints: 2,
    maxHitPoints: 6,
    armorSlots: 0,
    maxArmorSlots: 4,
  },
  {
    id: '789ghi',
    name: 'High Level Char',
    playerName: 'Bradley',
    hope: 4,
    stress: 2,
    maxStress: 8,
    hitPoints: 2,
    maxHitPoints: 8,
    armorSlots: 2,
    maxArmorSlots: 5,
  },
];

const games: Game[] = [
  {
    id: 'abc123',
    name: 'Beast Feast',
    gameMasterName: 'Bradley',
    fear: 8,
    shareCode: 'abcdef',
    characterIds: ['789ghi'],
  },
  {
    id: 'def456',
    name: 'Reign of the Weredragon',
    gameMasterName: 'Bradley',
    fear: 12,
    shareCode: 'ghijkl',
    characterIds: ['123abc', '456def'],
  },
];

export const data = {characters, games};
