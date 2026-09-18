import {Geist, TikTok_Sans} from 'next/font/google';

const geist = Geist({
  variable: '--font-copy',
  display: 'swap',
  subsets: ['latin'],
});
const tiktok = TikTok_Sans({
  variable: '--font-headings',
  display: 'swap',
  subsets: ['latin'],
  fallback: ['san-serif'],
});

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div
      className={`${geist.variable} ${tiktok.variable} flex min-h-full flex-1 flex-col antialiased`}
    >
      {children}
    </div>
  );
}
