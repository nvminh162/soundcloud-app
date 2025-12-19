import { sendRequest } from '@/utils/api';

export default async function ProfilePage({ params }: { params: { slug: string } }) {
    const res = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: 'http://localhost:8000/api/v1/tracks/users?current=1&pageSize=10',
        method: 'POST',
        body: { id: params.slug },
    });
    console.log(res);

    return <div>{params.slug}</div>;
}
