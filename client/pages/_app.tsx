import { AppProps } from 'next/app';
import { AuthenticationProvider } from '@/context/authentication';
import { NotificationProvider } from '@/components/notification';
import '../styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthenticationProvider>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </AuthenticationProvider>
  );
}
