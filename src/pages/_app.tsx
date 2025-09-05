// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@lib/store';
import ColorModeProvider from '@components/theme/ColorModeProvider';
import ErrorBoundary from '@components/ErrorBoundary';
import '../styles/globals.css';
import '../lib/i18n';
import { useSession } from 'next-auth/react';
import SignInSide from '../sign-in-side/SignInSide';

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <ReduxProvider store={store}>
          <ColorModeProvider>
            <AuthGate>
              <Component {...pageProps} />
            </AuthGate>
          </ColorModeProvider>
        </ReduxProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  if (status === 'loading') return null;
  if (!session) return <SignInSide />;
  return <>{children}</>;
}
