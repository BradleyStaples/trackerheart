import {Geist, Geist_Mono} from 'next/font/google';

const geistSans = Geist({variable: '--font-geist-sans', subsets: ['latin']});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} flex min-h-full flex-1 flex-col antialiased`}
    >
      {children}
    </div>
  );
}
