import "./globals.css";

export const metadata = {
  title: "Rookie Rumble · Jet HR",
  description: "Sistema di voto live per public speaking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="font-sans">{children}</body>
    </html>
  );
}
