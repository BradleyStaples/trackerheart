import type {InferGetServerSidePropsType, GetServerSideProps} from 'next';
import Character from '../../components/Character';
import Wrapper from '../../components/Wrapper';
import type {Character as CharacterType, Game} from '../../utils/types';
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
  const game = character ? await getGameForCharacter(character.id) : null;
  return {props: {character, game}};
}) satisfies GetServerSideProps<{
  character: CharacterType | null;
  game: Game | null;
}>;

export default function GamePage({
  character,
  game,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Wrapper>
      <Character
        key={character?.id}
        character={character ?? undefined}
        game={game ?? undefined}
      />
    </Wrapper>
  );
}
