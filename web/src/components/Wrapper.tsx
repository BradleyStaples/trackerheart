import Link from 'next/link';

interface Props {
  subtitle?: string;
  license?: boolean;
  children: React.ReactNode;
}

export default function Wrapper({subtitle, license = true, children}: Props) {
  return (
    <main className='flex flex-col py-8'>
      <div className='flex flex-col gap-4'>
        <div className='border-dh-blue mb-2 border-b-3 pb-2'>
          <h1 className='text-dh-gold px-16 text-center text-3xl font-semibold'>
            <Link
              className='transition-colors duration-300 hover:text-white'
              href='/'
            >
              Trackerheart
            </Link>
          </h1>
          {!!subtitle && (
            <h2 className='text-dh-teal mx-auto w-[480] max-w-full px-16 text-center text-2xl font-semibold'>
              {subtitle}
            </h2>
          )}
        </div>
        <div className='mx-auto w-[340] max-w-full'>{children}</div>
        {license && (
          <p className='text-dh-teal pt-8 text-center font-bold'>
            <Link href='/license'>License & Credits</Link>
          </p>
        )}
      </div>
    </main>
  );
}
