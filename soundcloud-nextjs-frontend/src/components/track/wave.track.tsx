'use client';
import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function WaveTrack() {

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            WaveSurfer.create({
                container: containerRef.current,
                waveColor: 'rgb(200, 0, 200)',
                progressColor: 'rgb(100, 0, 100)',
                url: '/audio/hoidanit.mp3',
            });
        }
    }, []);

    return <div ref={containerRef}>WaveTrack</div>;
}
