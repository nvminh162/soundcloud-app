import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { AuthOptions } from 'next-auth';

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
        jwt: ({ token, user, account, profile, trigger }) => {
            if (trigger === 'signIn' && account?.provider === 'github') {

            }
            return token;
        },
        session: ({ session, token, user }) => {

            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
