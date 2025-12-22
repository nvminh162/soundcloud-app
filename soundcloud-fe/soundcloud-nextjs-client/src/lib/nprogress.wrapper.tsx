'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import React from 'react';

export default function NProgressWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <ProgressBar height="2px" color="pink" options={{ showSpinner: false }} shallowRouting />
        </>
    );
}
