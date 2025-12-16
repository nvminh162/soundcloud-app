User: giải thích luồng next auth với social media github này

dựa vào fe của dự án qua trình nạp lấy jwt nạp

nói chung là giải thích luồng chạy tuần tự khi tôi bấm sign với github!

Workspace: Collecting workspace informationDựa vào code trong workspace, tôi sẽ giải thích luồng Next Auth với GitHub login như sau:

## Luồng chạy khi bấm Sign in with GitHub

### 1. **User clicks Sign In** 
Tại app.header.tsx, khi user chưa login sẽ thấy nút:

```tsx
<Link href={'#'} onClick={() => signIn()}>
    Login
</Link>
```

### 2. **Next Auth xử lý OAuth Flow**
- Next Auth redirect user đến GitHub OAuth
- User authorize trên GitHub
- GitHub redirect về callback URL: `/api/auth/callback/github`

### 3. **JWT Callback được trigger** 
Trong route.ts:

````typescript
async jwt({ token, user, account, profile, trigger }) {
    if (trigger === 'signIn' && account?.provider === 'github') {
        // Gọi API backend để lấy token
        const res = await sendRequest<IBackendRes<JWT>>({
            url: 'http://localhost:8000/api/v1/auth/social-media',
            method: 'POST',
            body: { type: 'GITHUB', username: user.email },
        });
        
        if (res.data) {
            // Lưu token vào JWT
            token.access_token = res?.data?.access_token;
            token.refresh_token = res?.data?.refresh_token;
            token.user = res?.data?.user;
        }
    }
    return token;
}
````

**Điều quan trọng**: JWT này được mã hóa và lưu dưới dạng **cookie** tại browser với tên `next-auth.session-token`.

### 4. **Session Callback được gọi**
Ngay sau khi JWT được tạo:

````typescript
session({ session, token, user }) {
    if (token) {
        // Nạp thông tin từ token vào session
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        session.user = token.user;
    }
    return session;
}
````

### 5. **Session Provider cung cấp data**
Tại next.auth.wrapper.tsx:

```tsx
<SessionProvider>{children}</SessionProvider>
```

Wrap toàn bộ app trong layout.tsx.

### 6. **Components sử dụng session**
Trong app.header.tsx:

```tsx
const { data: session } = useSession();
console.log('Check session: ', session);
```

Session sẽ chứa:
- `session.access_token` - JWT từ backend
- `session.refresh_token` - Refresh token
- `session.user` - User info từ backend

## Luồng Refresh trang

Như comment trong code giải thích:

> "Mỗi lần refresh lại trang, sẽ gọi token trên (từ cookies) gửi lên NextServer => phần token sẽ được giải mã => nạp vào session"

1. Browser gửi cookie `next-auth.session-token` 
2. Next Auth giải mã JWT từ cookie
3. Gọi `session()` callback để tạo session object
4. `useSession()` hook nhận session data

## Backend API Response

Dựa vào Postman collection, API `/api/v1/auth/social-media` trả về:

```json
{
  "statusCode": 201,
  "message": "fetch tokens for user login with social media account",
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "user": {
      "_id": "694141271...",
      "username": "abc@gmail.com",
      "email": "abc@gmail.com",
      "isVerify": true,
      "type": "GITHUB",
      "role": "USER"
    }
  }
}
```

## Tóm tắt

1. User click "Login" → `signIn()` từ next-auth
2. Redirect đến GitHub OAuth → User authorize
3. Callback về Next.js → **jwt callback** gọi backend API
4. Backend trả về `access_token`, `refresh_token`, `user`
5. Lưu vào JWT → mã hóa thành cookie
6. **session callback** nạp data từ JWT vào session
7. `useSession()` hook expose session cho components
8. Mỗi lần refresh: cookie → decode JWT → session

User: nói rõ lại

quá trình login và F5 refresh trang

GitHub Copilot: # Luồng Next Auth với GitHub - Chi tiết từng bước

## 🔐 QUÁ TRÌNH LOGIN (Lần đầu tiên)

### **Bước 1: User Click "Login"**
```tsx
// Tại app.header.tsx
<Link href={'#'} onClick={() => signIn()}>Login</Link>
```
- User bấm nút Login
- `signIn()` từ next-auth được gọi

### **Bước 2: Redirect đến GitHub OAuth**
```
Browser → GitHub OAuth Authorization Page
URL: https://github.com/login/oauth/authorize?client_id=xxx...
```
- Next Auth tự động redirect user đến GitHub
- User nhập username/password GitHub (nếu chưa login)
- User click "Authorize" để cho phép app truy cập

### **Bước 3: GitHub Callback**
```
GitHub → Redirect về Next.js
URL: http://localhost:3000/api/auth/callback/github?code=abc123...
```
- GitHub redirect về với `authorization code`
- Next Auth nhận code và đổi lấy GitHub access token

### **Bước 4: JWT Callback được trigger**
```typescript
// Trong route.ts - CHỈ CHẠY KHI LOGIN
async jwt({ token, user, account, profile, trigger }) {
    if (trigger === 'signIn' && account?.provider === 'github') {
        // ⚠️ CHỖ NÀY QUAN TRỌNG!
        
        // 1. Gọi API backend để tạo/lấy user
        const res = await sendRequest<IBackendRes<JWT>>({
            url: 'http://localhost:8000/api/v1/auth/social-media',
            method: 'POST',
            body: { 
                type: 'GITHUB', 
                username: user.email  // Email từ GitHub
            },
        });
        
        // 2. Backend trả về JWT của riêng mình
        if (res.data) {
            token.access_token = res.data.access_token;      // JWT backend
            token.refresh_token = res.data.refresh_token;    // Refresh token
            token.user = res.data.user;                       // User info
        }
    }
    return token; // ← Token này sẽ được mã hóa thành cookie
}
```

**Backend API Response:**
```json
{
  "statusCode": 201,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "694141271...",
      "username": "abc@gmail.com",
      "email": "abc@gmail.com",
      "type": "GITHUB",
      "role": "USER"
    }
  }
}
```

### **Bước 5: Token được mã hóa thành Cookie**
```
Next Auth tự động:
1. Lấy token object từ jwt() callback
2. Mã hóa token bằng process.env.NO_SECRET
3. Lưu vào cookie: "next-auth.session-token"
4. Gửi cookie về browser
```

**Cookie trông như thế này:**
```
next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0...; 
Path=/; 
HttpOnly; 
Secure; 
SameSite=Lax
```

### **Bước 6: Session Callback được gọi**
```typescript
// Ngay sau jwt(), session() được gọi
session({ session, token, user }) {
    if (token) {
        // Nạp dữ liệu từ token vào session
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        session.user = token.user;
    }
    return session; // ← Session này gửi về client
}
```

**Session object trả về:**
```javascript
{
  user: {
    _id: "694141271...",
    username: "abc@gmail.com",
    email: "abc@gmail.com",
    type: "GITHUB",
    role: "USER"
  },
  access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  expires: "2025-01-15T..."
}
```

### **Bước 7: Component nhận Session**
```tsx
// Tại app.header.tsx
const { data: session } = useSession();
console.log('Check session: ', session);

// session.user → User info
// session.access_token → Dùng để gọi API backend
```

---

## 🔄 QUÁ TRÌNH F5 REFRESH TRANG

### **Bước 1: Browser gửi Cookie lên Server**
```
Request Headers:
Cookie: next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0...
```

### **Bước 2: Next Auth giải mã Cookie**
```
Next.js Server:
1. Đọc cookie "next-auth.session-token"
2. Giải mã cookie bằng process.env.NO_SECRET
3. Lấy ra token object
```

**Token object sau giải mã:**
```javascript
{
  access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    _id: "694141271...",
    username: "abc@gmail.com",
    ...
  }
}
```

### **Bước 3: JWT Callback - KHÔNG gọi API**
```typescript
async jwt({ token, user, account, profile, trigger }) {
    // ⚠️ trigger !== 'signIn' nên SKIP if block
    if (trigger === 'signIn' && account?.provider === 'github') {
        // ← KHÔNG CHẠY VÀO ĐÂY KHI F5
    }
    
    return token; // Trả về token từ cookie (đã có sẵn)
}
```

**❌ KHÔNG gọi backend API**  
**✅ Chỉ lấy token từ cookie đã giải mã**

### **Bước 4: Session Callback - Nạp vào Session**
```typescript
session({ session, token, user }) {
    if (token) {
        // Nạp từ token (đã giải mã từ cookie)
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        session.user = token.user;
    }
    return session;
}
```

### **Bước 5: useSession() nhận Session**
```tsx
const { data: session } = useSession();
// session có đầy đủ thông tin như lúc login
```

---

## 📊 SO SÁNH LOGIN vs F5

| Bước | LOGIN (Lần đầu) | F5 REFRESH |
|------|----------------|------------|
| 1 | Click "Login" → GitHub OAuth | Browser gửi cookie lên |
| 2 | GitHub authorize → Callback | Next Auth giải mã cookie |
| 3 | **jwt() callback gọi backend API** | **jwt() callback SKIP API** |
| 4 | Backend trả JWT → Lưu vào token | Lấy token từ cookie |
| 5 | Token → Mã hóa → Cookie | Token → session() |
| 6 | session() nạp data | session() nạp data |
| 7 | useSession() có data | useSession() có data |

---

## 🔑 ĐIỂM QUAN TRỌNG

### **1. JWT Callback chỉ gọi API khi login:**
```typescript
if (trigger === 'signIn' && account?.provider === 'github') {
    // Chỉ true khi LOGIN, false khi F5
}
```

### **2. Cookie chứa TẤT CẢ thông tin:**
```javascript
Cookie (mã hóa) chứa:
- access_token (JWT backend)
- refresh_token
- user info
→ F5 chỉ cần giải mã cookie, KHÔNG cần gọi API
```

### **3. Session luôn được tạo mới:**
```typescript
// Mỗi request (login hay F5):
Token (từ cookie) → session() callback → Session object
```

### **4. Flow đơn giản hóa:**
```
LOGIN:  GitHub → Backend API → Token → Cookie → Session
F5:     Cookie → Token → Session (KHÔNG qua Backend)
```