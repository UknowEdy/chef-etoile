import PWAInstallBanner from './PWAInstallBanner';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PWAInstallBanner />
      {children}
    </>
  );
}
