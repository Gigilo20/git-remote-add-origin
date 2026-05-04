export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  );
}
