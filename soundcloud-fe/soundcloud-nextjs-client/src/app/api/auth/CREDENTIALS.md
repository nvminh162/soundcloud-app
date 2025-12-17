# Luồng Next Auth với CREDENTIALS (Username/Password)

## 🔐 QUÁ TRÌNH LOGIN (Lần đầu tiên)

### **Bước 1: User Click "Login"**
```tsx
// Tại app.header.tsx
<Link href={'#'} onClick={() => signIn()}>Login</Link>
```
- User bấm nút Login
- Next Auth hiển thị **form login** với Username và Password

### **Bước 2: User Submit Form**
```
POST /api/auth/callback/credentials

Body: {
  username: "abc@gmail.com",
  password: "123456"
}
```

### **Bước 3: authorize() callback được gọi**
```typescript
// Trong CredentialsProvider - route.ts
async authorize(credentials, req) {
    // 1. Gọi API backend để verify username/password
    const res = await sendRequest<IBackendRes<JWT>>({
        url: 'http://localhost:8000/api/v1/auth/login',
        method: 'POST',
        body: { 
            username: credentials?.username, 
            password: credentials?.password 
        },
    });

    if (res && res.data) {
        // 2. Backend trả về token → return về Next Auth
        return res.data as any;
    } else {
        // 3. Sai username/password → return null → Show error
        return null;
    }
}
```

**Backend Response (nếu đúng):**
```json
{
  "statusCode": 201,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "694141271...",
      "username": "abc@gmail.com",
      "email": "abc@gmail.com",
      "role": "USER"
    }
  }
}
```

### **Bước 4: JWT Callback - Lưu token**
```typescript
async jwt({ token, user, account, profile, trigger }) {
    if (trigger === 'signIn' && account?.provider === 'credentials') {
        // ⚠️ user chính là return value từ authorize()
        // ⚠️ KHÔNG gọi thêm API vì đã có token rồi
        
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.user = user.user;
    }
    return token; // → Token này sẽ được mã hóa thành cookie
}
```

**Lưu ý quan trọng:** 
- `user` object ở đây chính là `res.data` từ `authorize()`
- **KHÔNG cần gọi thêm API backend** vì token đã có sẵn

### **Bước 5: Token được mã hóa thành Cookie**
```
Next Auth tự động:
1. Lấy token object từ jwt() callback
2. Mã hóa token bằng process.env.NO_SECRET
3. Lưu vào cookie: "next-auth.session-token"
4. Gửi cookie về browser
```

**Cookie:**
```
next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0...; 
Path=/; 
HttpOnly; 
Secure; 
SameSite=Lax
```

### **Bước 6: Session Callback được gọi**
```typescript
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

**Session object:**
```javascript
{
  user: {
    _id: "694141271...",
    username: "abc@gmail.com",
    email: "abc@gmail.com",
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

// session.user → User info
// session.access_token → JWT backend để gọi API
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
    if (trigger === 'signIn' && account?.provider === 'credentials') {
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
| 1 | User nhập username/password | Browser gửi cookie lên |
| 2 | Submit form → `/callback/credentials` | Next Auth giải mã cookie |
| 3 | **authorize() gọi API `/login`** | **jwt() SKIP - KHÔNG gọi API** |
| 4 | Backend trả JWT → Return user | Lấy token từ cookie |
| 5 | jwt() lưu `user` vào token | jwt() trả về token có sẵn |
| 6 | Token → Mã hóa → Cookie | Token → session() |
| 7 | session() nạp data | session() nạp data |
| 8 | useSession() có data | useSession() có data |

---

## 🔑 ĐIỂM QUAN TRỌNG

### **1. authorize() chỉ chạy khi LOGIN:**
```typescript
async authorize(credentials, req) {
    // Chỉ được gọi khi user submit form
    // KHÔNG được gọi khi F5 refresh
    const res = await sendRequest(...);
    return res.data; // Token được return ở đây
}
```

### **2. JWT Callback xử lý khác với GitHub:**
```typescript
// CREDENTIALS: Token từ user (return của authorize)
if (trigger === 'signIn' && account?.provider === 'credentials') {
    token.access_token = user.access_token;  // ← Từ user
}

// GITHUB: Token từ API call mới
if (trigger === 'signIn' && account?.provider === 'github') {
    const res = await sendRequest(...);     // ← Gọi API
    token.access_token = res.data.access_token;
}
```

### **3. Cookie chứa TẤT CẢ thông tin:**
```javascript
Cookie (mã hóa) chứa:
- access_token (JWT từ backend)
- refresh_token
- user info (id, email, role...)
→ F5 chỉ cần giải mã cookie, KHÔNG cần gọi API
```

### **4. Flow đơn giản hóa:**
```
LOGIN:  Form → authorize() → Backend API → Token → jwt() → Cookie → Session
F5:     Cookie → Decode → Token → session() → Session (KHÔNG qua Backend)
```

---

## 🎯 TÓM TẮT

### **Số lần gọi API:**
- **Login**: 1 lần (trong `authorize()`)
- **F5 Refresh**: 0 lần (dùng cookie)

### **Luồng hoàn chỉnh:**
```
User Submit Form
    ↓
authorize() callback
    ↓
POST /api/v1/auth/login (Backend)
    ↓
Backend verify & return JWT
    ↓
authorize() return res.data
    ↓
jwt() callback receive user object
    ↓
token.access_token = user.access_token
    ↓
Token → Encode → Cookie
    ↓
session() callback
    ↓
session.access_token = token.access_token
    ↓
useSession() return session
    ↓
Components có access_token để gọi API khác
```

### **Khi F5:**
```
Browser gửi Cookie
    ↓
Next Auth decode Cookie → Token
    ↓
jwt() callback (không làm gì, return token)
    ↓
session() callback (nạp token vào session)
    ↓
useSession() return session
```
