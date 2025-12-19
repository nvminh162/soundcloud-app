'use client';
import { useHasMounted } from '@/utils/customHook';
import { AppBar, Container } from '@mui/material';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function AppFooter() {
    const hasMounted = useHasMounted();

    if (!hasMounted) return <></>;

    return (
        <div style={{ marginTop: 50 }}>
            <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, backgroundColor: '#f2f2f2' }}>
                <Container sx={{ display: 'flex', gap: 10, '.rhap_main': { gap: '30px' } }}>
                    <AudioPlayer
                        layout="horizontal-reverse"
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
                        volume={0.5}
                        style={{
                            boxShadow: 'unset',
                            background: '#f2f2f2',
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'start',
                            justifyContent: 'center',
                            minWidth: 100,
                        }}
                    >
                        <div style={{ color: '#ccc' }}>Eric</div>
                        <div style={{ color: 'black' }}>Who am I ?</div>
                    </div>
                </Container>
            </AppBar>
        </div>
    );
}
