import {Head, Html, Main, NextScript} from 'next/document';

export default function Document() {
  return (
    <Html lang='en' className='h-full'>
      <Head />
      <body className='flex min-h-full flex-col'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
