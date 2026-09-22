import Tracker from '../components/Tracker';
import Wrapper from '../components/Wrapper';
import useUUID from '../hooks/useUUID';

export default function HomePage() {
  useUUID();

  return (
    <Wrapper subtitle='An unofficial Daggerheart app to track GM & Player resources'>
      <Tracker />
    </Wrapper>
  );
}
