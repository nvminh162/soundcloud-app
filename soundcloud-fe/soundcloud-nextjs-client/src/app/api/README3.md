Ok, mình sẽ **setup một fetch wrapper “chuẩn Next.js App Router”** và giải thích **vì sao viết như vậy**, kèm **ví dụ dùng thật** 👌
(đúng kiểu production, không demo hời hợt)

---

# 1️⃣ Mục tiêu của fetch wrapper trong Next.js

Ta muốn 1 wrapper để:

✅ Dùng **Next.js fetch (cache / revalidate / no-store)**
✅ Tự xử lý error
✅ Gắn base URL
✅ Gắn Authorization (server-safe)
✅ Dùng được cho **Server Component / Route Handler / Server Action**

❌ Không phá static / ISR
❌ Không dùng axios

---

# 2️⃣ Cấu trúc thư mục (chuẩn)

```txt
src/
 ├─ lib/
 │   ├─ fetcher.ts      👈 wrapper
 │   └─ endpoints.ts
 ├─ app/
 │   ├─ hotels/
 │   │   └─ page.tsx
 │   └─ api/
```

---

# 3️⃣ Fetch wrapper chuẩn Next.js

## `src/lib/fetcher.ts`

```ts
type FetchOptions = RequestInit & {
  revalidate?: number;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetcher<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { revalidate, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${url}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(revalidate !== undefined && {
      next: { revalidate },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(
      `Fetch error ${res.status}: ${errorBody || res.statusText}`
    );
  }

  return res.json();
}
```

---

## 💡 Vì sao wrapper này “chuẩn Next”

### ✔ Không phá static / ISR

* Không set `cache: "no-store"` mặc định
* Cho phép truyền `revalidate`

### ✔ Không hard-code mode

→ Mỗi API tự quyết định:

| Truyền gì           | Mode    |
| ------------------- | ------- |
| Không truyền gì     | Static  |
| `revalidate: 60`    | ISR     |
| `cache: "no-store"` | Dynamic |

---

# 4️⃣ Ví dụ dùng trong Server Component

## Trang danh sách khách sạn (ISR)

```tsx
// app/hotels/page.tsx
import { fetcher } from "@/lib/fetcher";

type Hotel = {
  id: string;
  name: string;
};

export default async function HotelsPage() {
  const hotels = await fetcher<Hotel[]>("/hotels", {
    revalidate: 300, // 5 phút
  });

  return (
    <div>
      <h1>Danh sách khách sạn</h1>
      <ul>
        {hotels.map((h) => (
          <li key={h.id}>{h.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

✔ Render static
✔ Cache server
✔ 5 phút update 1 lần
✔ SEO tốt

---

# 5️⃣ Ví dụ Dynamic (SSR – data luôn mới)

```ts
await fetcher("/profile", {
  cache: "no-store",
});
```

➡️ Trang sẽ:

* Render mỗi request
* Không cache

🧠 Dùng cho:

* Profile
* Dashboard
* Data theo user

---

# 6️⃣ Ví dụ gọi API có token (Server-safe)

```ts
import { cookies } from "next/headers";

export async function getMe() {
  const token = cookies().get("accessToken")?.value;

  return fetcher("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}
```

✔ Token **không leak ra client**
✔ Chạy hoàn toàn trên server

---

# 7️⃣ So sánh với axios wrapper (để bạn “ngộ”)

| Tiêu chí         | fetch wrapper | axios wrapper |
| ---------------- | ------------- | ------------- |
| Static / ISR     | ✅             | ❌             |
| Cache server     | ✅             | ❌             |
| SEO              | ✅             | ❌             |
| Server Component | ✅             | ⚠️            |
| Interceptor      | ❌             | ✅             |

➡️ **Next.js ưu tiên fetch wrapper**

---

# 8️⃣ Khi nào tách 2 wrapper?

### Thực tế production hay dùng:

```
lib/
 ├─ fetcher.server.ts   👈 fetch (Next)
 ├─ axios.client.ts     👈 axios (client)
```

👉 Server = fetch
👉 Client = axios (nếu cần interceptor)

---

# 9️⃣ Một câu chốt để nhớ

> **Fetch wrapper trong Next không chỉ gọi API
> mà là điều khiển cache + render của cả trang**

---

Nếu bạn muốn, mình có thể:

* Viết **fetch wrapper cho CRUD (GET/POST/PUT/DELETE)**
* Gắn **tag-based revalidate**
* Áp vào **project đặt tour / khách sạn** của bạn
* So sánh **cùng API: fetch vs axios tốc độ**

👉 bạn muốn đi tiếp **phần nào sâu hơn?**
