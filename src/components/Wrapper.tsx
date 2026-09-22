interface Props {
  subtitle?: string;
  children: React.ReactNode;
}

export default function Wrapper({subtitle, children}: Props) {
  return (
    <div className='flex flex-1 flex-col items-center justify-center'>
      <main className='flex w-full flex-1 flex-col items-center justify-between py-8 sm:items-start'>
        <div className='flex w-full flex-col items-center gap-4 text-center sm:items-start sm:text-left'>
          <div className='border-dh-blue mb-2 w-full border-b-3 pb-2'>
            <h1 className='text-dh-gold px-16 text-center text-3xl font-semibold tracking-tight'>
              Trackerheart
            </h1>
            {!!subtitle && (
              <h2 className='text-dh-teal px-16 text-center text-2xl font-semibold tracking-tight'>
                {subtitle}
              </h2>
            )}
          </div>
          <div className='mx-auto w-[340]'>{children}</div>
        </div>
      </main>
    </div>
  );
}
