import React from 'react';
import { truncateText } from '../../utils/text';
import { Tooltip } from '@mui/material';


interface TextTruncatorProps {
    text: string;
    maxLength?: number;
    ellipsis?: string
}

const TextTruncator: React.FC<TextTruncatorProps> = ({
    text,
    maxLength = 50,
    ellipsis
}) => {
    return (
        <Tooltip title={text}>
            <span>
                {truncateText(text, maxLength)}
            </span>
        </Tooltip>
    );
};

export default TextTruncator;