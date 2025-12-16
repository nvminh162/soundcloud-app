import NextAuth, { DefaultSession } from 'next-auth';

interface IUser {
    _id: string;
    username: string;
    email: string;
    isVerify: boolean;
    type: string;
    role: string;
}

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        access_token: string;
        refresh_token: string;
        user: IUser;
    }
}

declare module 'next-auth/jwt' {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** The user's postal address. */
        access_token: string;
        refresh_token: string;
        user: IUser;
    }
}
