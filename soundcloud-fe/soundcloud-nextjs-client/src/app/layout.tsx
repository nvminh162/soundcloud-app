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

// Loading image too bad
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//     return (
//         <html lang="en">
//             <body>
//                 <img src="/flower/flowers.jpg" alt="123" />
//             </body>
//         </html>
//     );
// }

// import Image from 'next/image';
// import flower from '../../public/flower/flowers.jpg';
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//     return (
//         <html lang="en">
//             <body>
//                 <Image src={flower} alt="flower 2" sizes="100vw" style={{ width: '100%', height: 'auto' }} />
//             </body>
//         </html>
//     );
// }
