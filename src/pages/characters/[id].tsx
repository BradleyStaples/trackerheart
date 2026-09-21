import type {InferGetServerSidePropsType, GetServerSideProps} from 'next';
import Character from '../../components/Character';
import type {Character as CharacterType} from '../../utils/types';
import {getCharacterById, getGameForCharacter} from '../../utils/firestore';
import {DEVICE_ID_COOKIE} from '../../hooks/useUUID';

export const getServerSideProps = (async ({req, params}) => {
  const deviceId = req.cookies[DEVICE_ID_COOKIE] ?? null;
  let id = params?.id;
  if (Array.isArray(id)) {
    id = id[0];
  }
  const character = id
    ? ((await getCharacterById(id, deviceId)) ?? null)
    : null;
  const game = character ? await getGameForCharacter(character.id) : undefined;
  return {props: {character, game, deviceId}};
}) satisfies GetServerSideProps<{
  character: CharacterType | null;
  deviceId: string | null;
}>;

export default function GamePage({
  character,
  game,
  deviceId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className='flex flex-1 flex-col items-center justify-center'>
      <main className='flex w-full max-w-3xl flex-1 flex-col items-center justify-between px-16 py-8 sm:items-start'>
        <div className='flex flex-col items-center gap-4 text-center sm:items-start sm:text-left'>
          <div className='mb-2 border-b pb-2'>
            <h1 className='text-dh-gold text-3xl font-semibold tracking-tight'>
              Trackerheart
            </h1>
          </div>
          <Character character={character ?? undefined} game={game} />
        </div>
      </main>
    </div>
  );
}
