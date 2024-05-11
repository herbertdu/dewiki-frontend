import React from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TRANSLATION_PROGRESS } from '../constants/env';

interface TranslationProgressProps {
    translationProgress: string;
    handleTranslationProgress: (event: SelectChangeEvent<string>) => void;
}

export const TranslationProgress: React.FC<TranslationProgressProps> = ({ translationProgress, handleTranslationProgress }) => (
    <FormControl sx={{ width: '23ch', marginRight: '20px', marginBottom: '20px' }}>
        <InputLabel id="demo-simple-select-label">{'translation progress*'}</InputLabel>
        <Select
            id="demo-simple-select"
            value={translationProgress}
            label="Language"
            onChange={handleTranslationProgress}
            error={translationProgress === ''}
        >
            {TRANSLATION_PROGRESS.map((progress: any) => (
                <MenuItem value={progress} key={progress}>
                    {`${progress}`}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);
