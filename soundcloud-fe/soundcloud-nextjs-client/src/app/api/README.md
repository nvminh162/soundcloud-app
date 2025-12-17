Trong **Next.js**, **cả `fetch` và `axios` đều dùng tốt**, nhưng **khuyến nghị hiện tại là ưu tiên `fetch`** (đặc biệt từ Next.js 13+ với App Router).
Mình so sánh nhanh + chốt lựa chọn theo **từng tình huống thực tế** nhé 👇

---

## 1️⃣ `fetch` (khuyến nghị cho Next.js)

### ✅ Ưu điểm

* **Built-in trong Next.js** → không cần cài thêm thư viện
* **Tích hợp sâu với Next.js**

  * `cache`, `revalidate`
  * `fetch` trên **Server Component**
  * `static / dynamic rendering`
* Nhẹ, chuẩn Web API
* Hỗ trợ:

  ```ts
  fetch(url, { cache: "no-store" })
  fetch(url, { next: { revalidate: 60 } })
  ```

### ❌ Nhược điểm

* Phải **tự check lỗi HTTP**
* Không có interceptor sẵn
* Cú pháp hơi verbose

### Ví dụ chuẩn trong Next.js App Router

```ts
const res = await fetch("https://api.example.com/users", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  cache: "no-store",
});

if (!res.ok) {
  throw new Error("Failed to fetch users");
}

const data = await res.json();
```

### 💡 Khi nên dùng `fetch`

✔ App Router
✔ Server Components
✔ SEO / ISR / SSG
✔ Call API nội bộ
✔ Muốn tối ưu hiệu năng

---

## 2️⃣ `axios`

### ✅ Ưu điểm

* API **dễ dùng**
* Tự động throw error khi `status !== 2xx`
* **Interceptor** (rất mạnh)
* Tự parse JSON
* Quen thuộc với nhiều dev

### ❌ Nhược điểm

* **Không tích hợp cache / revalidate của Next**
* Thêm dependency
* Không tận dụng được sức mạnh Server Component

### Ví dụ axios

```ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const { data } = await api.get("/users");
```

### 💡 Khi nên dùng `axios`

✔ Dự án **CSR nặng**
✔ App Router nhưng gọi API từ **Client Component**
✔ Cần interceptor (refresh token, logging)
✔ Codebase cũ đã dùng axios

---

## 3️⃣ So sánh nhanh

| Tiêu chí         | fetch | axios    |
| ---------------- | ----- | -------- |
| Built-in Next.js | ✅     | ❌        |
| Server Component | ✅     | ⚠️       |
| Cache / ISR      | ✅     | ❌        |
| Interceptor      | ❌     | ✅        |
| Tự throw error   | ❌     | ✅        |
| Bundle size      | Nhẹ   | Nặng hơn |
| Chuẩn Web        | ✅     | ❌        |

---

## 4️⃣ Khuyến nghị thực tế (chuẩn production)

### 🔥 Best practice

> **Server → dùng `fetch`**
> **Client → có thể dùng `axios`**

### Ví dụ cấu trúc

```
/lib
 ├── fetcher.ts     (fetch cho server)
 ├── axios.ts       (axios cho client)
/app
 ├── page.tsx
```

---

## 5️⃣ Kết luận ngắn gọn

👉 **Next.js 13+ (App Router)**
✔ **Dùng `fetch` làm chính**
✔ `axios` chỉ dùng khi:

* Client Component
* Cần interceptor
* Quen axios / codebase cũ

---

Nếu bạn muốn mình:

* setup **fetch wrapper chuẩn Next**
* so sánh hiệu năng thực tế
* hay build **axios + refresh token** cho Next

👉 cứ nói mình hỗ trợ tiếp 👍
