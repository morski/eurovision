import { TextField } from "@mui/material";

import "./StyledTextField.css";

interface StyledTextFieldProps {
  fieldKey: string;
  error?: boolean;
  helperText?: string;
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

function StyledTextField({
  fieldKey,
  error = false,
  helperText,
  id,
  label,
  type = "text",
  value,
  onChange,
}: StyledTextFieldProps) {

  return (
    <TextField
      className='textfield--styled'
      key={fieldKey}
      error={error}
      helperText={helperText}
      id={id}
      label={label}
      type={type}
      value={value}
      variant='outlined'
      onChange={onChange}
    />
  );
}

export default StyledTextField;
