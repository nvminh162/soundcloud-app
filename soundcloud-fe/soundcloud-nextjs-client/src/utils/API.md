Viewed api.ts:1-97

Trong file [src/utils/api.ts](cci:7://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:0:0-0:0) của bạn, cơ chế caching được thực hiện thông qua việc sử dụng hàm [fetch](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:83:0-87:2) nguyên bản của trình duyệt (được Next.js mở rộng) thay vì dùng Axios.

Dưới đây là giải thích chi tiết cho các thắc mắc của bạn:

### 1. Cơ chế Caching trong file [api.ts](cci:7://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:0:0-0:0)

Nhìn vào hàm [sendRequest](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:3:0-41:2) của bạn:

```typescript
export const sendRequest = async <T>(props: IRequest) => {
    let {
        // ...
        nextOption = {} // <--- Đây là chìa khóa
    } = props;

    const options: any = {
        method: method,
        headers: new Headers({ 'content-type': 'application/json', ...headers }),
        body: body ? JSON.stringify(body) : null,
        ...nextOption // <--- Spread các tùy chọn của Next.js vào đây
    };

    return fetch(url, options).then(res => { ... });
};
```

**Cách thức hoạt động:**

- Khi bạn gọi [sendRequest](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:3:0-41:2) ở Server Component, bạn có thể truyền vào `nextOption`.
- **Ví dụ Cache 1 giờ:** [sendRequest({ ..., nextOption: { next: { revalidate: 3600 } } })](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:3:0-41:2).
- **Ví dụ không Cache (luôn lấy mới):** [sendRequest({ ..., nextOption: { cache: 'no-store' } })](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:3:0-41:2).
- Next.js ghi đè (monkey-patch) hàm toàn cục [fetch](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:83:0-87:2). Khi [fetch](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:83:0-87:2) được gọi, Next.js sẽ kiểm tra các tùy chọn trong `nextOption` để quyết định xem có lưu kết quả vào **Data Cache** (trên ổ đĩa server) hay không.

### 2. Vì sao nên dùng [fetch](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:83:0-87:2) thay vì `Axios` trong Next.js?

Mặc dù Axios rất mạnh mẽ, nhưng trong hệ sinh thái Next.js (đặc biệt là App Router), [fetch](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:83:0-87:2) được ưu tiên vì:

- **Tích hợp sâu với Data Cache**: Next.js mở rộng [fetch](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:83:0-87:2) để hỗ trợ caching và revalidating. Axios là thư viện bên thứ ba, nó không sử dụng hàm [fetch](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:83:0-87:2) đã được Next.js "vá", nên nó **không thể tự động lưu cache** vào hệ thống của Next.js trừ khi bạn tự viết code xử lý phức tạp.
- **Request Memoization**: Nếu bạn gọi cùng một bản ghi [fetch](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:83:0-87:2) với cùng URL và options ở nhiều nơi trong cùng một lượt render (ví dụ: cả ở Layout và Page), Next.js sẽ tự động chỉ gửi 1 request duy nhất. Axios sẽ gửi 2 request nếu bạn không cấu hình thêm.
- **Server-side bớt cồng kềnh**: Dùng [fetch](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:83:0-87:2) có sẵn giúp giảm kích thước bundle vì không cần cài thêm thư viện ngoài.

### 3. Next.js 15/16 có gì khác so với bản cũ (Next 14)?

Dự án hiện tại của bạn dùng **Next 14.0.2**. Nếu nâng cấp lên các bản mới hơn (như Next 15/16), có những thay đổi cực lớn về caching:

| Đặc điểm             | Next.js 14 (Của bạn)                                                                                                                            | Next.js 15/16 (Mới nhất)                                                                                                                                                                  |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mặc định Caching** | Mặc định là **Force Cache** (Lưu cache mãi mãi nếu không nói gì).                                                                               | Mặc định là **No Store** (Không lưu cache, luôn lấy mới).                                                                                                                                 |
| **Fetch API**        | [fetch(url)](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:83:0-87:2) sẽ được cache tự động. | [fetch(url)](cci:1://file:///d:/Course/soundcloud-app/soundcloud-fe/soundcloud-nextjs-client/src/utils/api.ts:83:0-87:2) sẽ KHÔNG được cache trừ khi bạn thêm `{ cache: 'force-cache' }`. |
| **Request APIs**     | `cookies()`, `headers()` dùng đồng bộ.                                                                                                          | `cookies()`, `headers()`, `params` trở thành **Async** (phải dùng `await`).                                                                                                               |
| **Server Actions**   | Đang ở giai đoạn ổn định ban đầu.                                                                                                               | Bảo mật hơn, hỗ trợ `useActionState` và tối ưu hóa việc gọi liên tục.                                                                                                                     |

**Lời khuyên:** Với bản cũ của bạn, nếu bạn không truyền `nextOption`, Next.js sẽ lưu cache "chết" các request GET. Sang bản mới, bạn sẽ phải chủ động định nghĩa khi nào muốn cache, giúp tránh lỗi hiển thị dữ liệu cũ (stale data) mà người dùng hay gặp phải.
