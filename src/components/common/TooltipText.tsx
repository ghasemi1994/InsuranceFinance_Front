import { Tooltip, Typography } from '@mui/material'
import React from 'react'


interface IProps {
    text: string
}

export default function TooltipText({ text }: IProps) {
    return (
        <>
            <Tooltip title={text}>
                <Typography>{text}</Typography>
            </Tooltip>
        </>
    )
}
