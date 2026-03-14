# SoundCloud Next.js Client

Dự án này là một ứng dụng SoundCloud-like được xây dựng bằng Next.js 14, tập trung vào trải nghiệm nghe nhạc mượt mà và giao diện hiện đại.

## Giải Thích Các Kỹ Thuật & Code Chi Tiết

### 1. Cấu Trúc Layout & Provider (Next.js App Router)
Trong Next.js 14, `layout.tsx` đóng vai trò là khung xương của ứng dụng. Bạn đã sử dụng mô hình "Composition" để bọc các Provider quan trọng.

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ThemeRegistry>      {/* Quản lý UI/UX Material UI */}
                    <NProgressWrapper> {/* Thanh progress khi chuyển trang */}
                        <ToastProvider>  {/* Thông báo (Toasty) */}
                            <NextAuthWrapper> {/* Xác thực người dùng */}
                                <TrackContextProvider> {/* Quản lý nhạc đang phát */}
                                    {children}
                                </TrackContextProvider>
                            </NextAuthWrapper>
                        </ToastProvider>
                    </NProgressWrapper>
                </ThemeRegistry>
            </body>
        </html>
    );
}
```

### 2. Xác Thực Người Dùng (Next-Auth)
Bạn đã triển khai Next-Auth để quản lý đăng nhập. Kỹ thuật này giúp bảo mật phía Client và Server.

- **Client Side Wrapper**: Sử dụng `SessionProvider` để các component con có thể gọi `useSession()`.
```tsx
// src/lib/next.auth.wrapper.tsx
'use client';
import { SessionProvider } from 'next-auth/react';

export default function NextAuthWrapper({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
```

- **Middleware (Protected Routes)**: Ngăn chặn người dùng chưa đăng nhập vào các trang như `/profile`, `/playlist`.
```tsx
// src/middleware.ts
export const config = { 
    matcher: ['/playlist', '/like', '/track/upload', "/profile"] 
};
```

### 3. Tích Hợp Material UI & Server Side Rendering (SSR)
Để MUI hoạt động mượt mà trong App Router (vốn ưu tiên Server Component), bạn đã dùng `ThemeRegistry` để "inject" style vào Server Side.

```tsx
// src/components/theme-registry/theme.registry.tsx
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
```

### 4. Quản Lý Trạng Thái Nhạc Toàn Cục (Context API)
Đây là phần quan trọng nhất để nhạc có thể phát xuyên suốt khi bạn chuyển trang mà không bị ngắt quãng.

```tsx
// src/lib/track.wrapper.tsx
export const TrackContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentTrack, setCurrentTrack] = useState<IShareTrack>(initialValue);

    return (
        <TrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
            {children}
        </TrackContext.Provider>
    )
};

// Sử dụng trong component
const { currentTrack, setCurrentTrack } = useTrackContext();
```

### 5. Tối Ưu Hóa Hình Ảnh (Next Image)
Bạn đã so sánh giữa việc dùng thẻ `<img>` thông thường (hiệu năng kém) và `next/image` (tự động resize, lazy load).

```tsx
// Ví dụ tối ưu trong layout hoặc component
import Image from 'next/image';
import flower from '../../public/flower/flowers.jpg';

<Image 
    src={flower} 
    alt="flower" 
    sizes="100vw" 
    style={{ width: '100%', height: 'auto' }} 
/>
```

### 6. SEO & Metadata
Next.js 14 cho phép khai báo Metadata trực tiếp (file-based). Dự án của bạn có:
- `manifest.ts`: Cấu hình PWA (Progressive Web App).
- `sitemap.ts`: Giúp Google dễ dàng index các bài hát.
- `robots.ts`: Cấu hình quyền truy cập cho bọ tìm kiếm.

---
*Phát triển bởi @nvminh162*
