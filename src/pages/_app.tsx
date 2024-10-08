// pages/_app.tsx
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import FloatingNavLayout from '@/components/ui/HomeNav';
import { useRouter } from 'next/router';
import { UserProvider } from '@/hooks/UserContext';
import UnifiedLayout from '@/components/ui/UnifiedLayout';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter()
  const showNav = router.pathname.startsWith('/profile')

  return (
    <SessionProvider session={session}>
      <Toaster/>
      <UserProvider>
        {/* <FloatingNavLayout showNav={showNav}> */}
        <UnifiedLayout>
          <Component {...pageProps} />
        </UnifiedLayout>
        {/* </FloatingNavLayout> */}
      </UserProvider>
    </SessionProvider>
  );
}

export default MyApp;
