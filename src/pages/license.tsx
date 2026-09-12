import Image from 'next/image';

export default function License() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <main className='flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black'>
        <div className='flex flex-col items-center gap-6 text-center sm:items-start sm:text-left'>
          <h1 className='max-w-xs text-lg leading-10 font-semibold tracking-tight text-black dark:text-zinc-50'>
            <div>
              <h1>License & Credits</h1>
              <p>
                <Image
                  src='/daggerheart-logo-small.png'
                  alt='Daggerheart'
                  width={25}
                  height={29}
                />
                <span>
                  This product includes material from the Daggerheart System
                  Reference Document 1.0, &copy; Critical Role, LLC, under the
                  terms of the Darrington Press Community Gaming License.
                </span>
              </p>
              <hr />
              <p>
                <span>
                  More at{' '}
                  <a href='https://www.daggerheart.com'>
                    https://www.daggerheart.com
                  </a>
                </span>
              </p>
              <Image
                src='/daggerheart-compatible-logo.webp'
                alt='Daggerheart Compatible'
                width={414}
                height={109}
              />
            </div>
          </h1>
        </div>
      </main>
    </div>
  );
}
