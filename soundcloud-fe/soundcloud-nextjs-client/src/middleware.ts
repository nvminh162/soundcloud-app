import { withAuth } from 'next-auth/middleware';

export default withAuth({
    // Matches the pages config in `[...nextauth]`
    pages: {
        signIn: '/auth/signin',
    },
});

export const config = { matcher: ['/playlist', '/like', '/track/upload', "/profile", "/track"] };
