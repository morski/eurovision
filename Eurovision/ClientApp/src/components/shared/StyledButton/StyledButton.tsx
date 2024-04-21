import { Button } from "@mui/material";

import "./StyledButton.css";

interface StyledButtonProps {
  children: string | JSX.Element | JSX.Element[];
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
}

function StyledButton({
  children,
  disabled,
  href,
  onClick,
}: StyledButtonProps) {
  return (
    <Button
      variant='outlined'
      size='large'
      className='button--styled'
      disabled={disabled}
      onClick={onClick}
      href={href}
    >
      {children}
    </Button>
  );
}

export default StyledButton;
