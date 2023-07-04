import '../styles/globals.scss';
import { AuthenticationProvider } from '@/context/authentication';

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthenticationProvider>
        <body>{children}</body>
      </AuthenticationProvider>
    </html>
  );
}
