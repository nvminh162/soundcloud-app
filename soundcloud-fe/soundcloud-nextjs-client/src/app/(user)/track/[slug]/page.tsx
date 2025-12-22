import WaveTrack from '@/components/track/wave.track';
import { sendRequest } from '@/utils/api';
import Container from '@mui/material/Container';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

// Thực hiện fetch data dùng để thay đổi title bài nhạc
export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    // Thực hiện cắt (split) để lấy id từ link Url (params.slug)
    const cleanSuffixHTML = params?.slug?.split('.html') ?? [];
    const temp = cleanSuffixHTML[0]?.split('-') as string[];
    const id = temp[temp.length - 1];

    // fetch data
    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: 'GET',
    });

    return {
        title: res.data?.title,
        description: res.data?.description,
        openGraph: {
            title: 'Thông tin SoundCloud',
            description: 'Beyond Your Coding Skills',
            type: 'website',
            images: [`https://avatars.githubusercontent.com/u/121565657?v=4`],
        },
    };
}

export default async function DetailTrackPage(props: any) {
    const { params } = props;

    const cleanSuffixHTML = params?.slug?.split('.html') ?? [];
    const temp = cleanSuffixHTML[0]?.split('-') as string[];
    const id = temp[temp.length - 1];

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${id}`,
        method: 'GET',
        nextOption: { cache: 'no-store' },
    });

    const resCmt = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `http://localhost:8000/api/v1/tracks/comments`,
        method: 'POST',
        queryParams: {
            current: 1,
            pageSize: 10,
            trackId: id,
        },
    });

    return (
        <Container>
            <div>
                <WaveTrack track={res?.data ?? null} comments={resCmt.data?.result ?? []} />
            </div>
        </Container>
    );
}
