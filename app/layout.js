import './globals.css';

export const metadata = {
  title: 'Urbana High School Class of 2006 | 20-Year Reunion',
  description: 'Official reunion website for the Urbana High School Class of 2006.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
