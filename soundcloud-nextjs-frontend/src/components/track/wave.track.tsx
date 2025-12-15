'use client';
import { useWavesurfer } from '@/utils/customHook';
import { useSearchParams } from 'next/navigation';
import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { WaveSurferOptions } from 'wavesurfer.js';

export default function WaveTrack() {
    const searchParams = useSearchParams();
    const fileName = searchParams.get('audio');
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
        return {
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            barWidth: 2.5,
            url: `/api?audio=${fileName}`,
        };
    }, [fileName]);

    const wavesurfer = useWavesurfer(containerRef, optionsMemo);

    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false);
        const subscriptions = [wavesurfer.on('play', () => setIsPlaying(true)), wavesurfer.on('pause', () => setIsPlaying(false))];
        return () => {
            subscriptions.forEach((unsub) => unsub());
        };
    }, [wavesurfer]);

    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
            setIsPlaying(wavesurfer.isPlaying());
        }
    }, [wavesurfer]);

    return (
        <div>
            <div ref={containerRef}>WaveTrack</div>
            <button onClick={onPlayClick}>{isPlaying ? 'Pause' : 'Play'}</button>
        </div>
    );
}
