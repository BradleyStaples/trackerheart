import type {InferGetServerSidePropsType, GetServerSideProps} from 'next';
import Game from '../../components/Game';
import type {Game as GameType} from '../../utils/types';
import {getGameById} from '../../utils/firestore';
import {DEVICE_ID_COOKIE} from '../../hooks/useUUID';

export const getServerSideProps = (async ({req, params}) => {
  const deviceId = req.cookies[DEVICE_ID_COOKIE] ?? null;
  let id = params?.id;
  if (Array.isArray(id)) {
    id = id[0];
  }
  const game = id ? ((await getGameById(id)) ?? null) : null;
  return {props: {game, deviceId}};
}) satisfies GetServerSideProps<{
  game: GameType | null;
  deviceId: string | null;
}>;

export default function GamePage({
  game,
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
          <Game game={game ?? undefined} />
        </div>
      </main>
    </div>
  );
}
