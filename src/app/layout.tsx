import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MR. FROZEN - Good Food • Frozen Fresh',
  description: 'Premium Pakistani frozen food brand delivering farm-fresh, wholesome, ready-to-cook delicacies including Shami Kebabs, Seekh Kebabs, Nuggets, and Tender Pops.',
  openGraph: {
    title: 'MR. FROZEN - Good Food • Frozen Fresh',
    description: 'Premium Pakistani frozen food brand delivering farm-fresh, wholesome, ready-to-cook delicacies including Shami Kebabs, Seekh Kebabs, Nuggets, and Tender Pops.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-cream text-brand-dark antialiased">
        {children}
      </body>
    </html>
  );
}
