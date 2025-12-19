'use client';
import { FileWithPath, useDropzone } from 'react-dropzone';
import './theme.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { sendRequestFile } from '@/utils/api';
import { useSession } from 'next-auth/react';
import axios from 'axios';

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
    setValue: (v: number) => void;
    trackUpload: { fileName: string; percent: number; uploadedTrackName: string; };
    setTrackUpload: Dispatch<SetStateAction<{ fileName: string; percent: number; uploadedTrackName: string }>>;
}

export default function StepOnce(props: IProps) {
    const { setValue, trackUpload, setTrackUpload } = props;
    const { data: session } = useSession();
    const onDrop = useCallback(
        async (acceptedFiles: FileWithPath[]) => {
            if (acceptedFiles && acceptedFiles[0]) {
                const audio = acceptedFiles[0];

                if (!audio.type.startsWith('audio/')) {
                    alert('Only audio files (.mp3, .m4a, .wav, ...) are allowed for this step.');
                    return;
                }

                setValue(1);
                const formData = new FormData();
                formData.append('fileUpload', audio);

                // Fetch
                /* const res = await sendRequestFile<IBackendRes<ITrackTop[]>>({
                    url: 'http://localhost:8000/api/v1/files/upload',
                    headers: {
                        Authorization: `Bearer ${session?.access_token}`,
                        target_type: 'tracks',
                    },
                    method: 'POST',
                    body: formData,
                }); */

                // Axios
                try {
                    const res = await axios.post('http://localhost:8000/api/v1/files/upload', formData, {
                        headers: {
                            Authorization: `Bearer ${session?.access_token}`,
                            target_type: 'tracks',
                            delay: 3000,
                        },
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total!);
                            setTrackUpload((prev) => ({
                                ...prev,
                                fileName: audio.name,
                                percent: percentCompleted,
                            }));
                        },
                    });
                    setTrackUpload((prev) => ({
                        ...prev,
                        uploadedTrackName: res.data.data.fileName,
                    }));
                } catch (error) {
                    // @ts-ignore
                    alert(error?.response?.data?.message);
                }
            }
        },
        [session],
    );

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'audio/mpeg': ['.mp3'],
            'audio/mp4': ['.m4a'],
            'audio/wav': ['.wav'],
        },
        onDropRejected: () => {
            alert('Only audio files (.mp3, .m4a, .wav, ...) are allowed for this step.');
        },
    });

    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <InputFileUpload />
                <p>Click or Drag/Drop here to uploads file track</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
}
