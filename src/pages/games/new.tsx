import Game from '../../components/Game';
import Wrapper from '../../components/Wrapper';

export default function NewGamePage() {
  return (
    <Wrapper>
      <Game game={undefined} characters={[]} />
    </Wrapper>
  );
}
