import PWAInstallBanner from './PWAInstallBanner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PWAInstallBanner />
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
