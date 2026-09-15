import Tracker from '../components/Tracker';

export default function Home() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center'>
      <main className='flex w-full max-w-3xl flex-1 flex-col items-center justify-between px-16 py-8 sm:items-start'>
        <div className='flex flex-col items-center gap-4 text-center sm:items-start sm:text-left'>
          <div className='mb-2 border-b pb-2'>
            <h1 className='text-dh-gold text-3xl font-semibold tracking-tight'>
              Trackerheart
            </h1>
            <h2 className='text-dh-teal text-2xl font-semibold tracking-tight'>
              An unofficial Daggerheart app to track GM & Player resources
            </h2>
          </div>
          <Tracker />
        </div>
      </main>
    </div>
  );
}
