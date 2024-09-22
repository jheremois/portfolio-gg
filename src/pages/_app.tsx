// pages/_app.tsx
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Toaster/>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
