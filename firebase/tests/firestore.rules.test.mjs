// Tests every allow and deny path in firestore.rules against the Firestore
// emulator. Run with `npm test`, which starts the emulator first.
import {readFileSync} from 'node:fs';
import {after, before, beforeEach, describe, test} from 'node:test';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

const GM = 'gm-uid';
const PLAYER = 'player-uid';
const STRANGER = 'stranger-uid';

const GAME_ID = 'game-1';
const SHARE_CODE = 'ABC123';
const CHARACTER_ID = 'character-1';

let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-trackerheart',
    firestore: {
      rules: readFileSync(
        new URL('../firestore.rules', import.meta.url),
        'utf8',
      ),
    },
  });
});

after(() => testEnv.cleanup());

beforeEach(() => testEnv.clearFirestore());

function db(uid) {
  return uid
    ? testEnv.authenticatedContext(uid).firestore()
    : testEnv.unauthenticatedContext().firestore();
}

function gameData(ownerUid, overrides = {}) {
  return {
    name: 'The Witherwild',
    gameMasterName: 'Sam',
    fear: 4,
    shareCode: SHARE_CODE,
    ownerUid,
    createdAt: serverTimestamp(),
    lastModifiedAt: serverTimestamp(),
    ...overrides,
  };
}

function characterData(ownerUid, overrides = {}) {
  return {
    name: 'Marlowe',
    playerName: 'Alex',
    hope: 2,
    hitPoints: 1,
    maxHitPoints: 6,
    stress: 0,
    maxStress: 6,
    armorSlots: 0,
    maxArmorSlots: 3,
    ownerUid,
    createdAt: serverTimestamp(),
    lastModifiedAt: serverTimestamp(),
    ...overrides,
  };
}

function mappingData(overrides = {}) {
  return {
    characterId: CHARACTER_ID,
    gameId: GAME_ID,
    playerUid: PLAYER,
    gmUid: GM,
    shareCode: SHARE_CODE,
    createdAt: serverTimestamp(),
    lastModifiedAt: serverTimestamp(),
    ...overrides,
  };
}

// The Game and its share code in one batch, as web/src/utils/firestore.ts
// writes them.
function createGameBatch(
  uid,
  {
    gameId = GAME_ID,
    code = SHARE_CODE,
    game = {},
    shareCode = {},
    signedIn = true,
  } = {},
) {
  const firestore = db(signedIn ? uid : undefined);
  const batch = writeBatch(firestore);
  batch.set(
    doc(firestore, 'Games', gameId),
    gameData(uid, {shareCode: code, ...game}),
  );
  batch.set(doc(firestore, 'ShareCodes', code), {
    gameId,
    ownerUid: uid,
    ...shareCode,
  });
  return batch.commit();
}

// Seeding bypasses the rules.
function seed(write) {
  return testEnv.withSecurityRulesDisabled((context) =>
    write(context.firestore()),
  );
}

function seedGame({gameId = GAME_ID, code = SHARE_CODE, ownerUid = GM} = {}) {
  return seed(async (firestore) => {
    await setDoc(
      doc(firestore, 'Games', gameId),
      gameData(ownerUid, {shareCode: code}),
    );
    await setDoc(doc(firestore, 'ShareCodes', code), {gameId, ownerUid});
  });
}

function seedCharacter({characterId = CHARACTER_ID, ownerUid = PLAYER} = {}) {
  return seed((firestore) =>
    setDoc(doc(firestore, 'Characters', characterId), characterData(ownerUid)),
  );
}

function seedMapping(overrides = {}) {
  return seed((firestore) =>
    setDoc(
      doc(firestore, 'GameCharacters', CHARACTER_ID),
      mappingData(overrides),
    ),
  );
}

describe('Games', () => {
  test('GM creates a Game with its share code in one batch', async () => {
    await assertSucceeds(createGameBatch(GM));
  });

  test('a Game without its share code is rejected', async () => {
    await assertFails(setDoc(doc(db(GM), 'Games', GAME_ID), gameData(GM)));
  });

  test('a share code already held by another Game is rejected', async () => {
    await seedGame({gameId: 'other-game', ownerUid: STRANGER});
    await assertFails(createGameBatch(GM));
  });

  test('creating a Game requires sign-in', async () => {
    await assertFails(createGameBatch(GM, {signedIn: false}));
  });

  test('a Game owned by someone else is rejected', async () => {
    await assertFails(createGameBatch(GM, {game: {ownerUid: STRANGER}}));
  });

  test('Fear outside 0-12 is rejected', async () => {
    await assertFails(createGameBatch(GM, {game: {fear: 13}}));
    await assertFails(createGameBatch(GM, {game: {fear: -1}}));
  });

  test('a non-integer Fear is rejected', async () => {
    await assertFails(createGameBatch(GM, {game: {fear: 4.5}}));
  });

  test('a malformed share code is rejected', async () => {
    await assertFails(createGameBatch(GM, {code: 'abc123'}));
  });

  test('a name over 100 characters is rejected', async () => {
    await assertFails(createGameBatch(GM, {game: {name: 'x'.repeat(101)}}));
  });

  test('client-set timestamps are rejected', async () => {
    await assertFails(
      createGameBatch(GM, {game: {createdAt: Timestamp.now()}}),
    );
  });

  test('extra fields are rejected', async () => {
    await assertFails(createGameBatch(GM, {game: {extra: true}}));
  });

  test('any signed-in user can get a Game by ID', async () => {
    await seedGame();
    await assertSucceeds(getDoc(doc(db(STRANGER), 'Games', GAME_ID)));
    await assertFails(getDoc(doc(db(undefined), 'Games', GAME_ID)));
  });

  test('listing Games must filter on the caller as owner', async () => {
    await seedGame();
    await assertSucceeds(
      getDocs(query(collection(db(GM), 'Games'), where('ownerUid', '==', GM))),
    );
    await assertFails(getDocs(collection(db(GM), 'Games')));
  });

  test('the GM updates the editable fields', async () => {
    await seedGame();
    await assertSucceeds(
      updateDoc(doc(db(GM), 'Games', GAME_ID), {
        fear: 7,
        lastModifiedAt: serverTimestamp(),
      }),
    );
  });

  test('updates must set lastModifiedAt from the server', async () => {
    await seedGame();
    await assertFails(updateDoc(doc(db(GM), 'Games', GAME_ID), {fear: 7}));
  });

  test('the share code and owner never change', async () => {
    await seedGame();
    const ref = doc(db(GM), 'Games', GAME_ID);
    await assertFails(
      updateDoc(ref, {shareCode: 'ZZZ999', lastModifiedAt: serverTimestamp()}),
    );
    await assertFails(
      updateDoc(ref, {ownerUid: STRANGER, lastModifiedAt: serverTimestamp()}),
    );
  });

  test('Fear updates outside 0-12 are rejected', async () => {
    await seedGame();
    await assertFails(
      updateDoc(doc(db(GM), 'Games', GAME_ID), {
        fear: 13,
        lastModifiedAt: serverTimestamp(),
      }),
    );
  });

  test('only the GM updates or deletes the Game', async () => {
    await seedGame();
    const ref = doc(db(STRANGER), 'Games', GAME_ID);
    await assertFails(
      updateDoc(ref, {fear: 7, lastModifiedAt: serverTimestamp()}),
    );
    await assertFails(deleteDoc(ref));
    await assertSucceeds(deleteDoc(doc(db(GM), 'Games', GAME_ID)));
  });
});

describe('ShareCodes', () => {
  test('any signed-in user can get a code, but no one can list them', async () => {
    await seedGame();
    await assertSucceeds(getDoc(doc(db(STRANGER), 'ShareCodes', SHARE_CODE)));
    await assertFails(getDoc(doc(db(undefined), 'ShareCodes', SHARE_CODE)));
    await assertFails(getDocs(collection(db(GM), 'ShareCodes')));
  });

  test("a code can't point at someone else's Game", async () => {
    await seedGame({code: 'OLD000', ownerUid: STRANGER});
    await assertFails(
      setDoc(doc(db(GM), 'ShareCodes', 'NEW000'), {
        gameId: GAME_ID,
        ownerUid: GM,
      }),
    );
  });

  test("codes can't be updated", async () => {
    await seedGame();
    await assertFails(
      updateDoc(doc(db(GM), 'ShareCodes', SHARE_CODE), {gameId: 'other-game'}),
    );
  });

  test('only the owner deletes a code', async () => {
    await seedGame();
    await assertFails(deleteDoc(doc(db(STRANGER), 'ShareCodes', SHARE_CODE)));
    await assertSucceeds(deleteDoc(doc(db(GM), 'ShareCodes', SHARE_CODE)));
  });
});

describe('Characters', () => {
  test('a player creates a Character', async () => {
    await assertSucceeds(
      setDoc(
        doc(db(PLAYER), 'Characters', CHARACTER_ID),
        characterData(PLAYER),
      ),
    );
  });

  test('out-of-range values are rejected', async () => {
    const ref = doc(db(PLAYER), 'Characters', CHARACTER_ID);
    await assertFails(setDoc(ref, characterData(PLAYER, {hope: 7})));
    await assertFails(setDoc(ref, characterData(PLAYER, {hitPoints: 7})));
    await assertFails(setDoc(ref, characterData(PLAYER, {stress: 7})));
    await assertFails(setDoc(ref, characterData(PLAYER, {armorSlots: 4})));
    await assertFails(setDoc(ref, characterData(PLAYER, {maxHitPoints: 13})));
  });

  test('extra fields and other owners are rejected', async () => {
    const ref = doc(db(PLAYER), 'Characters', CHARACTER_ID);
    await assertFails(setDoc(ref, characterData(PLAYER, {extra: true})));
    await assertFails(setDoc(ref, characterData(STRANGER)));
  });

  test('the owner gets a Character; strangers and the GM of no Game do not', async () => {
    await seedCharacter();
    await assertSucceeds(getDoc(doc(db(PLAYER), 'Characters', CHARACTER_ID)));
    await assertFails(getDoc(doc(db(STRANGER), 'Characters', CHARACTER_ID)));
    await assertFails(getDoc(doc(db(GM), 'Characters', CHARACTER_ID)));
  });

  test("the GM gets a Character that joined their Game, but can't list them", async () => {
    await seedGame();
    await seedCharacter();
    await seedMapping();
    await assertSucceeds(getDoc(doc(db(GM), 'Characters', CHARACTER_ID)));
    await assertFails(getDocs(collection(db(GM), 'Characters')));
  });

  test('listing Characters must filter on the caller as owner', async () => {
    await seedCharacter();
    await assertSucceeds(
      getDocs(
        query(
          collection(db(PLAYER), 'Characters'),
          where('ownerUid', '==', PLAYER),
        ),
      ),
    );
    await assertFails(getDocs(collection(db(PLAYER), 'Characters')));
  });

  test('the owner updates the editable fields', async () => {
    await seedCharacter();
    await assertSucceeds(
      updateDoc(doc(db(PLAYER), 'Characters', CHARACTER_ID), {
        hitPoints: 3,
        lastModifiedAt: serverTimestamp(),
      }),
    );
  });

  test('the owner never changes, and out-of-range updates are rejected', async () => {
    await seedCharacter();
    const ref = doc(db(PLAYER), 'Characters', CHARACTER_ID);
    await assertFails(
      updateDoc(ref, {ownerUid: STRANGER, lastModifiedAt: serverTimestamp()}),
    );
    await assertFails(
      updateDoc(ref, {hitPoints: 7, lastModifiedAt: serverTimestamp()}),
    );
  });

  test('only the owner updates or deletes a Character, not even the GM', async () => {
    await seedGame();
    await seedCharacter();
    await seedMapping();
    for (const uid of [STRANGER, GM]) {
      const ref = doc(db(uid), 'Characters', CHARACTER_ID);
      await assertFails(
        updateDoc(ref, {hope: 3, lastModifiedAt: serverTimestamp()}),
      );
      await assertFails(deleteDoc(ref));
    }
    await assertSucceeds(
      deleteDoc(doc(db(PLAYER), 'Characters', CHARACTER_ID)),
    );
  });
});

describe('GameCharacters', () => {
  beforeEach(async () => {
    await seedGame();
    await seedCharacter();
  });

  test('a player joins a Game with its share code', async () => {
    await assertSucceeds(
      setDoc(doc(db(PLAYER), 'GameCharacters', CHARACTER_ID), mappingData()),
    );
  });

  test('the GM must match the share code owner', async () => {
    await assertFails(
      setDoc(
        doc(db(PLAYER), 'GameCharacters', CHARACTER_ID),
        mappingData({gmUid: STRANGER}),
      ),
    );
  });

  test('the share code must name the Game', async () => {
    await seedGame({gameId: 'other-game', code: 'OTHER1'});
    await assertFails(
      setDoc(
        doc(db(PLAYER), 'GameCharacters', CHARACTER_ID),
        mappingData({shareCode: 'OTHER1'}),
      ),
    );
  });

  test("a player can't join with someone else's Character", async () => {
    await assertFails(
      setDoc(
        doc(db(STRANGER), 'GameCharacters', CHARACTER_ID),
        mappingData({playerUid: STRANGER}),
      ),
    );
  });

  test('the document ID must be the characterId', async () => {
    await assertFails(
      setDoc(doc(db(PLAYER), 'GameCharacters', 'other-id'), mappingData()),
    );
  });

  test('client-set timestamps and extra fields are rejected', async () => {
    const ref = doc(db(PLAYER), 'GameCharacters', CHARACTER_ID);
    await assertFails(setDoc(ref, mappingData({createdAt: Timestamp.now()})));
    await assertFails(setDoc(ref, mappingData({extra: true})));
  });

  test('the player switches to another Game', async () => {
    await seedMapping();
    await seedGame({gameId: 'game-2', code: 'GAME02', ownerUid: STRANGER});
    await assertSucceeds(
      setDoc(
        doc(db(PLAYER), 'GameCharacters', CHARACTER_ID),
        mappingData({gameId: 'game-2', gmUid: STRANGER, shareCode: 'GAME02'}),
      ),
    );
  });

  test("the GM can't rewrite a mapping", async () => {
    await seedMapping();
    await assertFails(
      setDoc(
        doc(db(GM), 'GameCharacters', CHARACTER_ID),
        mappingData({playerUid: GM}),
      ),
    );
  });

  test('the player and the GM read a mapping; strangers do not', async () => {
    await seedMapping();
    await assertSucceeds(
      getDoc(doc(db(PLAYER), 'GameCharacters', CHARACTER_ID)),
    );
    await assertSucceeds(getDoc(doc(db(GM), 'GameCharacters', CHARACTER_ID)));
    await assertFails(
      getDoc(doc(db(STRANGER), 'GameCharacters', CHARACTER_ID)),
    );
  });

  test('queries must filter on the caller as player or GM', async () => {
    await seedMapping();
    const mappings = (uid) => collection(db(uid), 'GameCharacters');
    await assertSucceeds(
      getDocs(
        query(
          mappings(GM),
          where('gameId', '==', GAME_ID),
          where('gmUid', '==', GM),
        ),
      ),
    );
    await assertSucceeds(
      getDocs(
        query(
          mappings(PLAYER),
          where('characterId', '==', CHARACTER_ID),
          where('playerUid', '==', PLAYER),
        ),
      ),
    );
    await assertFails(
      getDocs(query(mappings(GM), where('gameId', '==', GAME_ID))),
    );
  });

  test('the player leaves, or the GM removes the Character', async () => {
    await seedMapping();
    await assertFails(
      deleteDoc(doc(db(STRANGER), 'GameCharacters', CHARACTER_ID)),
    );
    await assertSucceeds(
      deleteDoc(doc(db(PLAYER), 'GameCharacters', CHARACTER_ID)),
    );
    await seedMapping();
    await assertSucceeds(
      deleteDoc(doc(db(GM), 'GameCharacters', CHARACTER_ID)),
    );
  });
});

describe('write sequences from web/src/utils/firestore.ts', () => {
  test('deleting a Game removes its code and mappings in one batch', async () => {
    await seedGame();
    await seedCharacter();
    await seedMapping();
    const firestore = db(GM);
    const batch = writeBatch(firestore);
    batch.delete(doc(firestore, 'Games', GAME_ID));
    batch.delete(doc(firestore, 'ShareCodes', SHARE_CODE));
    batch.delete(doc(firestore, 'GameCharacters', CHARACTER_ID));
    await assertSucceeds(batch.commit());
  });

  test('deleting a Character removes its mapping in one batch', async () => {
    await seedGame();
    await seedCharacter();
    await seedMapping();
    const firestore = db(PLAYER);
    const batch = writeBatch(firestore);
    batch.delete(doc(firestore, 'Characters', CHARACTER_ID));
    batch.delete(doc(firestore, 'GameCharacters', CHARACTER_ID));
    await assertSucceeds(batch.commit());
  });

  test("deleting a mapping that doesn't exist is rejected", async () => {
    await seedCharacter();
    await assertFails(
      deleteDoc(doc(db(PLAYER), 'GameCharacters', CHARACTER_ID)),
    );
  });
});
