# SoundCloud Next.js Client

Dự án này là một ứng dụng SoundCloud-like được xây dựng bằng Next.js 14, tập trung vào trải nghiệm nghe nhạc mượt mà và giao diện hiện đại.

## Các Kỹ Thuật & Công Nghệ Sử Dụng

### 1. Core Framework & Routing
- **Next.js 14 (App Router)**: Sử dụng kiến trúc App Router mới nhất để tối ưu hóa hiệu năng và SEO.
- **Route Groups**: Tổ chức mã nguồn linh hoạt với Route Groups (`(user)`, `(guest)`) để phân tách logic giao diện cho người dùng và khách.
- **Dynamic Routes**: Xử lý các trang chi tiết bản nhạc (`/track/[id]`) động.
- **Middleware**: Sử dụng Next.js Middleware để kiểm soát quyền truy cập trang (Protected Routes).

### 2. Authentication
- **Next-Auth**: Triển khai hệ thống xác thực (Authentication/Authorization) mạnh mẽ, quản lý Session và JWT.
- **Auth Wrapper**: Tích hợp Session Provider để cung cấp thông tin người dùng xuyên suốt ứng dụng.

### 3. UI & Styling
- **Material UI v5 (MUI)**: Hệ thống UI component chất lượng cao.
- **Theme Registry**: Tùy chỉnh SSR-compatible Theme cho MUI để tránh hiện tượng mất style khi load trang.
- **Emotion**: Thư viện CSS-in-JS mạnh mẽ đi kèm với MUI.
- **Sass (SCSS)**: Sử dụng các biến và mixin SCSS cho các component tùy chỉnh.
- **Custom Components**: Xây dựng UI modular với Header, Footer, MediaCard, Profile, v.v.

### 4. Audio Features
- **Wavesurfer.js**: Hiển thị dạng sóng (waveform) động và tương tác cho các bản nhạc.
- **React H5 Audio Player**: Trình phát nhạc với đầy đủ chức năng và giao diện tinh tế.
- **Track Wrapper**: Quản lý trạng thái phát nhạc toàn cục (playing, pause, playlist).

### 5. Data Fetching & State
- **Axios**: Công cụ chính để giao tiếp với backend REST API.
- **Query String**: Xử lý URL parameters linh hoạt.
- **Typescript**: Đảm bảo an toàn kiểu dữ liệu (Type-safe) cho toàn bộ dự án.

### 6. Optimization & SEO
- **Next/Image**: Tối ưu hóa hình ảnh tự động (kết hợp với thư viện `sharp`).
- **SEO Optimization**: Tự động tạo `manifest.ts`, `robots.ts`, và `sitemap.ts`.
- **NProgress**: Hiển thị thanh tiến trình khi chuyển trang (smooth transitions).

### 7. Other Features
- **Slick Carousel**: Hiển thị danh sách bản nhạc dưới dạng slider mượt mà.
- **React Dropzone**: Hỗ trợ tải lên file nhạc với tính năng kéo thả.
- **Slugify**: Tạo URL thân thiện từ tiêu đề bản nhạc.
- **Dayjs**: Xử lý và định dạng thời gian chuyên nghiệp.

### 8. Tooling & Deployment
- **Docker**: Container hóa ứng dụng với `Dockerfile` và script build.
- **ESLint & Prettier**: Đảm bảo chất lượng code và định dạng thống nhất.
- **Environment Variables**: Quản lý cấu hình linh hoạt qua `.env`.

---
*Phát triển bởi @nvminh162*
