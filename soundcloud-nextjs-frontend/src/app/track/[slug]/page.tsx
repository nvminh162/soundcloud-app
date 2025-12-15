'use client';

import WaveTrack from '@/components/track/wave.track';
import { useSearchParams } from 'next/navigation';

export default function DetailTrackPage(props: any) {
    const { params } = props;
    const searchParams = useSearchParams();
    const search = searchParams.get('audio');

    return (
        <div>
            <WaveTrack />
        </div>
    );
}
