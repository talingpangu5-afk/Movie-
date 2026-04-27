import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ultimate KuCoin Guide (2026): Crypto Earning and Passive Income Revealed',
  description: 'Master KuCoin with our 2026 guide. Learn about KuCoin earning methods, affiliate signup, security, and how to maximize your passive income daily.',
  keywords: ['KuCoin Affiliate Signup', 'KuCoin review', 'KuCoin earning methods', 'Is KuCoin safe', 'KuCoin passive income', 'Best crypto exchange 2026', 'KuCoin trading guide', 'KuCoin bonus signup', 'Crypto earning without investment'],
  openGraph: {
    title: 'Ultimate KuCoin Guide (2026): Crypto Earning and Passive Income Revealed',
    description: 'Master KuCoin with our 2026 guide. Learn about KuCoin earning methods, affiliate signup, security, and how to maximize your passive income daily.',
    type: 'article',
    url: 'https://ais-dev-23omtqrzp6udxupsp5k7xg-124825520938.asia-southeast1.run.app/blog', // Adjust to production URL if needed
    images: [
      {
        url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2574&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'KuCoin Guide 2026',
      },
    ],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
