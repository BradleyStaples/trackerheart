import type {AppProps} from 'next/app';
import Head from 'next/head';
import Layout from '../components/Layout';
import '../styles/globals.css';

export default function App({Component, pageProps}: AppProps) {
  return (
    <Layout>
      <Head>
        <title>Trackerheart - A Daggerheart tracker app</title>
        <meta
          name='description'
          content='Trackerheart is a Daggerheart tracker app for players and GMs'
        />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
