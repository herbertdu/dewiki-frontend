import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';

export const StyledTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: 'gray',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'black',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'black',
        },
        '&.Mui-error fieldset': {
            borderColor: 'red',
        },
    },
    marginBottom: '20px',
    marginRight: '20px',
});

export default StyledTextField;