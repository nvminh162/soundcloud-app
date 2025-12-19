'use client';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material';
import { useEffect, useState } from 'react';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

function LinearWithValueLabel(props: IProps) {
    const { trackUpload } = props;
    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={trackUpload.percent} />
        </Box>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function InputFileUpload() {
    return (
        <Button
            onClick={(e) => e.preventDefault()}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            Upload files
            <VisuallyHiddenInput type="file" onChange={(event) => console.log(event.target.files)} multiple />
        </Button>
    );
}

interface IProps {
    trackUpload: { fileName: string; percent: number; uploadedTrackName: string };
}

interface INewTrack {
    title: string;
    description: string;
    trackUrl: string;
    imgUrl: string;
    category: string;
}

export default function StepSecond(props: IProps) {
    const { trackUpload } = props;
    const [info, setInfo] = useState<INewTrack>({
        title: '',
        description: '',
        trackUrl: '',
        imgUrl: '',
        category: '',
    });
    console.log(trackUpload);

    const category = [
        {
            value: 'CHILL',
            label: 'CHILL',
        },
        {
            value: 'WORKOUT',
            label: 'WORKOUT',
        },
        {
            value: 'PARTY',
            label: 'PARTY',
        },
    ];

    useEffect(() => {
        if (trackUpload && trackUpload.uploadedTrackName) {
            setInfo({
                ...info,
                trackUrl: trackUpload.uploadedTrackName,
            });
        }
    }, [trackUpload]);

    console.log(info);

    return (
        <div>
            <div>
                <div>Your uploading track: {trackUpload.fileName}</div>
                <LinearWithValueLabel trackUpload={trackUpload} />
            </div>

            <Grid container spacing={2} mt={5}>
                <Grid
                    item
                    xs={6}
                    md={4}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: '10px',
                    }}
                >
                    <div style={{ height: 250, width: 250, background: '#ccc' }}>
                        <div></div>
                    </div>
                    <div>
                        <InputFileUpload />
                    </div>
                </Grid>
                <Grid item xs={6} md={8}>
                    <TextField
                        value={info?.title}
                        onChange={(e) => setInfo({ ...info, title: e.target.value })}
                        label="Title"
                        variant="standard"
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        value={info?.description}
                        onChange={(e) => setInfo({ ...info, description: e.target.value })}
                        label="Description"
                        variant="standard"
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        value={info?.category}
                        onChange={(e) => setInfo({ ...info, category: e.target.value })}
                        sx={{
                            mt: 3,
                        }}
                        select
                        label="Category"
                        fullWidth
                        variant="standard"
                        //   defaultValue="EUR"
                    >
                        {category.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        variant="outlined"
                        sx={{
                            mt: 5,
                        }}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}
