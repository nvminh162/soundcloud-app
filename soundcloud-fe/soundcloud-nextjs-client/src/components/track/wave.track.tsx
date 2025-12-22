'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWavesurfer } from '@/utils/customHook';
import { WaveSurferOptions } from 'wavesurfer.js';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import './wave.scss';
import { formatTime } from '@/utils/timeHelper';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import { useTrackContext } from '@/lib/track.wrapper';
import CommentTrack from './comment.track';
import LikeTrack from './like.track';
import { sendRequest } from '@/utils/api';

interface IProps {
    track: ITrackTop | null;
    comments: ITrackComment[];
}

const WaveTrack = (props: IProps) => {
    const { track, comments } = props;
    const router = useRouter();

    const firstViewRef = useRef(true);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const fileName = searchParams.get('audio');

    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);

    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    const [time, setTime] = useState<string>('0:00');
    const [duration, setDuration] = useState<string>('0:00');

    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
        let gradient, progressGradient;
        if (typeof window !== 'undefined') {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
            gradient.addColorStop(0, '#656666'); // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666'); // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1'); // Bottom color
            gradient.addColorStop(1, '#B1B1B1'); // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
            progressGradient.addColorStop(0, '#EE772F'); // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926'); // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094'); // Bottom color
            progressGradient.addColorStop(1, '#F6B094'); // Bottom color
        }

        return {
            waveColor: gradient,
            progressColor: progressGradient,
            height: 100,
            barWidth: 3,
            url: `/api?audio=${fileName}`,
        };
    }, []);

    const wavesurfer = useWavesurfer(containerRef, optionsMemo);

    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false);

        const hover = hoverRef.current!;
        const waveform = containerRef.current!;
        waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`));

        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('decode', (duration) => {
                setDuration(formatTime(duration));
            }),
            wavesurfer.on('timeupdate', (currentTime) => {
                setTime(formatTime(currentTime));
            }),
            wavesurfer.once('interaction', () => {
                wavesurfer.play();
            }),
        ];

        return () => {
            subscriptions.forEach((unsub) => unsub());
        };
    }, [wavesurfer]);

    // On play button click
    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
        }
    }, [wavesurfer]);

    const calLeft = (moment: number) => {
        const hardCodeDuration = wavesurfer?.getDuration() ?? 0;
        const percent = (moment / hardCodeDuration) * 100;
        return `${percent}%`;
    };

    useEffect(() => {
        if (wavesurfer && currentTrack.isPlaying) {
            wavesurfer.pause();
        }
    }, [currentTrack]);

    useEffect(() => {
        if (track?._id && !currentTrack?._id) {
            setCurrentTrack({ ...track, isPlaying: false });
        }
    }, [track]);

    const handleIncreaseView = async () => {
        if (firstViewRef.current) {
            await sendRequest({
                url: `http://localhost:8000/api/v1/tracks/increase-view`,
                method: 'POST',
                body: { trackId: track?._id },
            });
            router.refresh();
            firstViewRef.current = false;
        }
    };

    return (
        <div style={{ marginTop: 20 }}>
            <div
                style={{
                    display: 'flex',
                    gap: 15,
                    padding: 20,
                    height: 400,
                    background: 'linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)',
                }}
            >
                <div
                    className="left"
                    style={{
                        width: '75%',
                        height: 'calc(100% - 10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <div className="info" style={{ display: 'flex' }}>
                        <div>
                            <div
                                onClick={() => {
                                    onPlayClick();
                                    handleIncreaseView();
                                    if (track && wavesurfer) {
                                        setCurrentTrack({ ...currentTrack, isPlaying: false });
                                    }
                                }}
                                style={{
                                    borderRadius: '50%',
                                    background: '#f50',
                                    height: '50px',
                                    width: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                {isPlaying === true ? (
                                    <PauseIcon sx={{ fontSize: 30, color: 'white' }} />
                                ) : (
                                    <PlayArrowIcon sx={{ fontSize: 30, color: 'white' }} />
                                )}
                            </div>
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <div
                                style={{
                                    padding: '0 5px',
                                    background: '#333',
                                    fontSize: 30,
                                    width: 'fit-content',
                                    color: 'white',
                                }}
                            >
                                {track?.title}
                            </div>
                            <div
                                style={{
                                    padding: '0 5px',
                                    marginTop: 10,
                                    background: '#333',
                                    fontSize: 20,
                                    width: 'fit-content',
                                    color: 'white',
                                }}
                            >
                                {track?.description}
                            </div>
                        </div>
                    </div>
                    <div ref={containerRef} className="wave-form-container">
                        <div className="time">{time}</div>
                        <div className="duration">{duration}</div>
                        <div ref={hoverRef} className="hover-wave"></div>
                        <div
                            className="overlay"
                            style={{
                                position: 'absolute',
                                height: '30px',
                                width: '100%',
                                bottom: '0',
                                // background: "#ccc"
                                backdropFilter: 'brightness(0.5)',
                            }}
                        ></div>
                        <div className="comments" style={{ position: 'relative' }}>
                            {comments.map((item) => {
                                return (
                                    <Tooltip title={item.content} arrow key={item._id}>
                                        <Image
                                            onPointerMove={(e) => {
                                                const hover = hoverRef.current!;
                                                hover.style.width = calLeft(item.moment + 3);
                                            }}
                                            style={{
                                                height: 20,
                                                width: 20,
                                                position: 'absolute',
                                                top: 71,
                                                zIndex: 20,
                                                left: calLeft(item.moment),
                                            }}
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/chill1.png`}
                                            alt="comment icon"
                                            width={20}
                                            height={20}
                                        />
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div
                    className="right"
                    style={{
                        width: '25%',
                        padding: 15,
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                    }}
                >
                    {track?.imgUrl ? (
                        <div>
                            <Image alt="" src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`} width={250} height={250} />
                        </div>
                    ) : (
                        <div
                            style={{
                                background: '#ccc',
                                width: 250,
                                height: 250,
                            }}
                        ></div>
                    )}
                </div>
            </div>
            <div>
                <LikeTrack track={track} />
            </div>
            <div>
                <CommentTrack comments={comments} track={track} wavesurfer={wavesurfer} />
            </div>
        </div>
    );
};

export default WaveTrack;
