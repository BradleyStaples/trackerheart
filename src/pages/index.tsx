import Tracker from '../components/Tracker';

export default function Home() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center'>
      <main className='flex w-full max-w-3xl flex-1 flex-col items-center justify-between px-16 py-32 sm:items-start'>
        <div className='flex flex-col items-center gap-6 text-center sm:items-start sm:text-left'>
          <h1 className='text-dh-gold text-3xl leading-10 font-semibold tracking-tight'>
            Trackerheart
          </h1>
          <h2 className='text-dh-teal text-2xl leading-10 font-semibold tracking-tight'>
            An unofficial Daggerheart app to track GM & Player resources
          </h2>
          <Tracker />
        </div>
      </main>
    </div>
  );
}
