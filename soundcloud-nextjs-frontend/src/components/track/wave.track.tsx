'use client';
import { useWavesurfer } from '@/utils/customHook';
import { useSearchParams } from 'next/navigation';
import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { WaveSurferOptions } from 'wavesurfer.js';
import './wave.scss';

export default function WaveTrack() {
    const searchParams = useSearchParams();
    const fileName = searchParams.get('audio');
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        // Define the waveform gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1);
        gradient.addColorStop(0, '#656666'); // Top color
        gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666'); // Top color
        gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
        gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
        gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1'); // Bottom color
        gradient.addColorStop(1, '#B1B1B1'); // Bottom color
        // Define the progress gradient
        const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1);
        progressGradient.addColorStop(0, '#EE772F'); // Top color
        progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926'); // Top color
        progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
        progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
        progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094'); // Bottom color
        progressGradient.addColorStop(1, '#F6B094'); // Bottom color

        return {
            waveColor: gradient,
            progressColor: progressGradient,
            height: 150,
            barWidth: 2,
            url: `/api?audio=${fileName}`,
        };
    }, [fileName]);

    const wavesurfer = useWavesurfer(containerRef, optionsMemo);

    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false);
        const timeEl = document.querySelector('#time')!;
        const durationEl = document.querySelector('#duration')!; //jquery

        const hover = document.querySelector('#hover')!;
        const waveform = containerRef.current!;
        //@ts-ignore
        waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))

        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('decode', (duration) => (durationEl.textContent = formatTime(duration))),
            wavesurfer.on('timeupdate', (currentTime) => (timeEl.textContent = formatTime(currentTime))),
        ];
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

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secondsRemaining = Math.round(seconds) % 60;
        const paddedSeconds = `0${secondsRemaining}`.slice(-2);
        return `${minutes}:${paddedSeconds}`;
    };

    return (
        <div style={{ marginTop: 100 }}>
            <div ref={containerRef} className="wave-form-container">
                <div id="time">0:00</div>
                <div id="duration">0:00</div>
                <div id="hover">0:00</div>
            </div>
            <button onClick={onPlayClick}>{isPlaying ? 'Pause' : 'Play'}</button>
        </div>
    );
}
