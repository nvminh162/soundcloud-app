import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { AuthOptions } from 'next-auth';
import { sendRequest } from '@/utils/api';
import { JWT } from 'next-auth/jwt';

export const authOptions: AuthOptions = {
    secret: process.env.NO_SECRET!,
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        // ...add more providers here
    ],
    /*
    15 C14 => 012 1333
    Mỗi lần login thành công (jwt: ({ token })) sẽ được lưu dưới dạng cookies tại phía browser của client
    Mỗi lần refresh lại trang, sẽ gọi token trên gửi lên NextServer => phàn token sẽ được giải mã => nạp vào session
     */
    callbacks: {
        async jwt({ token, user, account, profile, trigger }) {
            if (trigger === 'signIn' && account?.provider === 'github') {
                // call api
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: 'http://localhost:8000/api/v1/auth/social-media',
                    method: 'POST',
                    body: { type: 'GITHUB', username: user.email },
                });
                if (res.data) {
                    token.access_token = res?.data?.access_token;
                    token.refresh_token = res?.data?.refresh_token;
                    token.user = res?.data?.user;
                }
            }
            return token;
        },
        session({ session, token, user }) {
            if (token) {
                session.access_token = token.access_token;
                session.refresh_token = token.refresh_token;
                session.user = token.user;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
