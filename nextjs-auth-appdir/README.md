```Test Next Auth
Tài liệu:
https://gitlab.com/public-starter-projects1/01-nextjs-basic-soundcloud/nextjs-authappdir

Yêu cầu: đã có tài khoản github (và cài git)

1. Tạo github Client
https://authjs.dev/getting-started/oauth-tutorial#2-configuring-oauth-provider

Bước 1:
Go to: https://github.com/settings/developers

Bước 2: fill thông tin
Homepage URL= http://localhost:3000
Authorization callback URL = http://localhost:3000/api/auth/callback/github

Bước 3: Tạo client ID/client secret
- Tạo file .env
- update file .env
```