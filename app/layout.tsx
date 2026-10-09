import type { Metadata, Viewport } from 'next';
import './globals.css';

const title = 'CareerQuest: your career discovery adventure';
const description = 'Choose your character, discover your strengths, try a day in a career, and watch your path evolve.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000'),
  title: { default: title, template: '%s · CareerQuest' },
  description,
  openGraph: { title, description, type: 'website', images: ['/images/quest-world.jpg'] },
  twitter: { card: 'summary_large_image', title, description },
};
export const viewport: Viewport = { themeColor: '#277E75', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
