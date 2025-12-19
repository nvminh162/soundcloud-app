'use client';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import StepOnce from './step/step.once';
import StepSecond from './step/step.second';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

// SEO Support for better
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function UploadTabs() {
    const [value, setValue] = React.useState(0);
    const [trackUpload, setTrackUpload] = React.useState({
        fileName: '',
        percent: 0,
        uploadedTrackName: '',
    });

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Container
            sx={{
                marginTop: '30px',
                border: '1px solid #ddd',
            }}
        >
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Tracks" {...a11yProps(0)} />
                        <Tab label="Basic information" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <StepOnce setValue={setValue} trackUpload={trackUpload} setTrackUpload={setTrackUpload} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <StepSecond trackUpload={trackUpload} />
                </CustomTabPanel>
            </Box>
        </Container>
    );
}
