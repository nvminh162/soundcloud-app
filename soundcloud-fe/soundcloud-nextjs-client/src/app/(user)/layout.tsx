import AppFooter from '@/components/footer/app.footer';
import AppHeader from '@/components/header/app.header';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tiêu đề from layout',
    description: 'Miêu tả layout nè',
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppHeader />
            {children}
            <div style={{ marginBottom: '100px' }} />
            <AppFooter />
        </>
    );
}
