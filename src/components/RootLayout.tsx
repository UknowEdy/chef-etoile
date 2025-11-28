import { ReactNode } from 'react';
import PWAInstallBanner from './PWAInstallBanner';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <PWAInstallBanner />
      {children}
    </>
  );
}
