import type {InferGetServerSidePropsType, GetServerSideProps} from 'next';
import Game from '../../components/Game';
import type {Game as GameType, Character} from '../../utils/types';
import {getGameById, getCharactersInGame} from '../../utils/firestore';
import {DEVICE_ID_COOKIE} from '../../hooks/useUUID';
import Wrapper from '../../components/Wrapper';

export const getServerSideProps = (async ({req, params}) => {
  const deviceId = req.cookies[DEVICE_ID_COOKIE] ?? null;
  let id = params?.id;
  if (Array.isArray(id)) {
    id = id[0];
  }
  const game = id ? ((await getGameById(id, deviceId)) ?? null) : null;
  const characters = game ? await getCharactersInGame(game.id) : [];
  return {props: {game, characters}};
}) satisfies GetServerSideProps<{
  game: GameType | null;
  characters: Character[];
}>;

export default function GamePage({
  game,
  characters,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Wrapper>
      <Game key={game?.id} game={game ?? undefined} characters={characters} />
    </Wrapper>
  );
}
