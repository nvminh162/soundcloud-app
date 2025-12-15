'use client';
import { useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function WaveTrack() {
    useEffect(() => {
        const element = document.getElementById('nvminh162');
        if (element) {
            WaveSurfer.create({
                container: element,
                waveColor: 'rgb(200, 0, 200)',
                progressColor: 'rgb(100, 0, 100)',
                url: 'http://localhost:3000/audio/hoidanit.mp3',
            });
        }
    }, []);

    return <div id="nvminh162">WaveTrack</div>;
}
