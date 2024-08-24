import React from 'react';
import Box from '@mui/material/Box';

export default function Setting({ content, sx }) {
    const settingSX = {
        textAlign: 'center',
        fontSize: '1.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    // Merge settingSX and sx, with sx taking priority
    const mergedSX = {
        ...settingSX,
        ...sx,
    };

    return (
        <Box sx={mergedSX}>
            {content}
        </Box>
    );
}
