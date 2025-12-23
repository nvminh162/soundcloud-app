import AppFooter from '@/components/footer/app.footer';
import AppHeader from '@/components/header/app.header';
import Script from 'next/script';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tiêu đề from layout',
    description: 'Miêu tả layout',
};

const idJsonObject = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Minh SoundCloud',
    description: 'Ứng dụng web phát nhạc phục vụ học tập và thực hành Next.js 14.',
    applicationCategory: 'Music',
    operatingSystem: 'Web',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    url: 'https://soundcloud-app.local',
    publisher: {
        '@type': 'Organization',
        name: 'Minh SoundCloud Team',
    },
    softwareVersion: '0.1.0',
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppHeader />
            {children}
            <div style={{ marginBottom: '100px' }} />
            <AppFooter />
            <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(idJsonObject) }} />
        </>
    );
}
