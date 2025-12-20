import ThemeRegistry from '@/components/theme-registry/theme.registry';
import NextAuthWrapper from '@/lib/next.auth.wrapper';
import { ToastProvider } from '@/lib/toast';
import { TrackContextProvider } from '@/lib/track.wrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body suppressHydrationWarning>
                {/* Caching data MUI */}
                <ThemeRegistry>
                    <ToastProvider>
                        {/* chia sẽ session giữa các component */}
                        <NextAuthWrapper>
                            <TrackContextProvider>{children}</TrackContextProvider>
                        </NextAuthWrapper>
                    </ToastProvider>
                </ThemeRegistry>
            </body>
        </html>
    );
}
