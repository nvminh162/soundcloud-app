'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useMemo } from 'react';
import WaveSurfer from 'wavesurfer.js';

const useWavesurfer = (containerRef: any, options: any) => {
    const [wavesurfer, setWavesurfer] = useState<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ws = WaveSurfer.create({
            ...options,
            container: containerRef.current,
        });

        setWavesurfer(ws);

        return () => {
            ws.destroy();
        };
    }, [options, containerRef]); // ✅ OK vì options là useMemo

    return wavesurfer;
};

export default function WaveTrack() {
    const searchParams = useSearchParams();
    const fileName = searchParams.get('audio');
    const containerRef = useRef<HTMLDivElement>(null);

    // ✅ Dùng useMemo với dependency [fileName]
    const optionsMemo = useMemo(() => {
        return {
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            url: `/api?audio=${fileName}`,
        };
    }, [fileName]); // ⚠️ Thêm fileName vào dependency!

    const wavesurfer = useWavesurfer(containerRef, optionsMemo);

    return <div ref={containerRef}>WaveTrack</div>;
}