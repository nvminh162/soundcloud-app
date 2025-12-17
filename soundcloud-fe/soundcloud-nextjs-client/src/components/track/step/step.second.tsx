'use client'

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import { styled } from '@mui/material';


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

function LinearWithValueLabel() {
    const [progress, setProgress] = React.useState(10);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={progress} />
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

export default function StepSecond() {
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

    return (
        <div>
            <div>
                <div>Your uploading track:</div>
                <LinearWithValueLabel />
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
                    <TextField id="standard-basic" label="Title" variant="standard" fullWidth margin="dense" />
                    <TextField id="standard-basic" label="Description" variant="standard" fullWidth margin="dense" />
                    <TextField
                        sx={{
                            mt: 3,
                        }}
                        id="outlined-select-currency"
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
