import Game from '../../components/Game';

export default function NewGamePage() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center'>
      <main className='flex w-full max-w-3xl flex-1 flex-col items-center justify-between px-16 py-8 sm:items-start'>
        <div className='flex flex-col items-center gap-4 text-center sm:items-start sm:text-left'>
          <div className='mb-2 border-b pb-2'>
            <h1 className='text-dh-gold text-3xl font-semibold tracking-tight'>
              Trackerheart
            </h1>
          </div>
          <Game />
        </div>
      </main>
    </div>
  );
}
