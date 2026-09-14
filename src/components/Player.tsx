import Button from './Button';

export default function Player() {
  return (
    <>
      <h3>Player</h3>
      <h4>Your Characters:</h4>
      <ul>
        <li>You do not have any Characters.</li>
      </ul>
      <Button label='Add New Character' role='primary' />
    </>
  );
}
