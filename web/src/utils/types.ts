export interface Character {
  id: string;
  name: string;
  playerName: string;
  hope: number;
  stress: number;
  maxStress: number;
  hitPoints: number;
  maxHitPoints: number;
  armorSlots: number;
  maxArmorSlots: number;
  ownerUid: string; // Firebase Auth uid of the Player who created it
  createdAt?: string; // ISO 8601, set by Firestore's serverTimestamp()
  lastModifiedAt?: string; // ISO 8601, set by Firestore's serverTimestamp()
}

export interface Game {
  id: string;
  name: string;
  gameMasterName: string;
  fear: number;
  shareCode: string;
  ownerUid: string; // Firebase Auth uid of the GM who created it
  createdAt?: string; // ISO 8601, set by Firestore's serverTimestamp()
  lastModifiedAt?: string; // ISO 8601, set by Firestore's serverTimestamp()
}

// fields a user edits on a Game; the id, owner, share code and timestamps are
// set by firestore.ts
export type GameInput = Pick<Game, 'name' | 'gameMasterName' | 'fear'>;

// fields a user edits on a Character; the id, owner and timestamps are set by
// firestore.ts
export type CharacterInput = Omit<
  Character,
  'id' | 'ownerUid' | 'createdAt' | 'lastModifiedAt'
>;
