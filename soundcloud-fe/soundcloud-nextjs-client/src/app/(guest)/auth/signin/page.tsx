import { authOptions } from '@/app/api/auth/auth.options';
import AuthSignIn from '@/components/auth/auth.signin';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function SigninPage() {
    const session = await getServerSession(authOptions);

    if (session) {
      // redirect home page
      redirect('/')
    }

    return (
        <>
            <AuthSignIn />
        </>
    );
}
