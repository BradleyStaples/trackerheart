import Button from './Button';

export default function GameMaster() {
  return (
    <>
      <h3>Game Master</h3>
      <h4>Your Games:</h4>
      <ul>
        <li>You do not have any Games.</li>
      </ul>
      <Button label='Add New Game' role='primary' />
    </>
  );
}
