import WaveTrack from '@/components/track/wave.track';
import { sendRequest } from '@/utils/api';
import Container from '@mui/material/Container';

export default async function DetailTrackPage(props: any) {
    const { params } = props;

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
        method: 'GET',
        nextOption: { cache: "no-store" }
    });

    const resCmt = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `http://localhost:8000/api/v1/tracks/comments`,
        method: 'POST',
        queryParams: {
            current: 1,
            pageSize: 10,
            trackId: params.slug,
        },
    });

    return (
        <Container>
            <div>
                <WaveTrack track={res?.data ?? null} comments={resCmt.data?.result ?? []}  />
            </div>
        </Container>
    );
}
