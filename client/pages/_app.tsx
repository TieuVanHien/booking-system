import { AppProps } from 'next/app';
import { AuthenticationProvider } from '@/context/authentication';
import '../styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthenticationProvider>
      <Component {...pageProps} />
    </AuthenticationProvider>
  );
}
