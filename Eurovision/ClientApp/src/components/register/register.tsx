import { FunctionComponent, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./register.css";
import AuthService from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, TextField, styled, useMediaQuery } from "@mui/material";

const CssTextField = styled(TextField)({
  paddingBottom: '16px',
  color: 'white',
  width: '75%',
  fontFamily: 'gotham-book',
  '& label.Mui-focused': {
    color: 'white',
  },
  '& label': {
    color: 'white',
    fontFamily: 'gotham-book',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
  '& .MuiOutlinedInput-root': {
    fontFamily: 'gotham-book',
    '& fieldset': {
      borderColor: 'white',
      color: 'white'
    },
    '&:hover fieldset': {
      borderColor: 'white',
      borderWidth: '2px'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
    '& .MuiOutlinedInput-input': {
      color: 'white'
    }
  },
});

const StyledButton = styled(Button)({
  borderColor: 'white',
  color: 'white',
  fontFamily: 'gotham-book',
  margin: '16px 0',
  '&:hover': {
    borderColor: 'white',
  }
});

const Register: FunctionComponent = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [username, setUsername] = useState<string>('');
  const [usernameChanged, setUsernameChanged] = useState<boolean>(false);
  
  const [password, setPassword] = useState<string>('');
  const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
  
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleRegister = () => {
    
    if(username.length == 0 || password.length == 0) {
      setUsernameChanged(true);
      setPasswordChanged(true);
      return;
    }
    setMessage('');
    setLoading(true);

    AuthService.register(
      username,
      password
    )
      .then(response => {
        if(response.ok) {
          return response.json();
        }
        else {
          response.json().then((err) => {
            setMessage(err.error);
            setLoading(false);
          })
        }
      })
      .then(response => {
        if (response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("refreshToken", response.refreshToken);
          localStorage.setItem("user", JSON.stringify({userId: response.userId, username: response.username}));
          navigate("/");
        }
      })
      .catch(err => {
        const resMessage =
          (err.response &&
            err.response.data &&
            err.response.data.message) ||
          err.message ||
          err.toString();

        setMessage(resMessage);
        
      });
  }

  const isUserNameValid = () => username.length > 0 || !usernameChanged ? true : false;
  const getUsernameHelperText = () => username.length > 0 || !usernameChanged ? '' : 'Username is empty';
  const isPasswordValid = () => password.length > 0 || !passwordChanged ? true : false;
  const getPasswordHelperText = () => password.length > 0 || !passwordChanged ? '' : 'Password is empty';

  const mobile = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{
      display: 'flex', 
      flexDirection: 'column', 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      justifyContent: 'center', 
      alignItems: 'center',
      width: 'calc(100% - 40px)',
      maxWidth: '900px',
      backgroundColor: '#1d1b54',
      borderRadius: '4px',
      fontFamily: 'gotham-book',
      py: '16px'}}>
      <Box sx={{maxWidth: mobile ? '100%' : '75%', justifyContent: 'center', paddingBottom: '16px', px: '16px'}}>
          <Box component="img" src="/images/2023/logo/ESC2023_Ukraine_LIVERPOOL_RGB_White.png" alt="logo" sx={{maxWidth: '100%'}}/>
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
        <CssTextField error={!isUserNameValid()} helperText={getUsernameHelperText()} key={'username'} id="outlined-basic" label="Username" variant="outlined" value={username} onChange={(e) => {setUsername(e.target.value); setUsernameChanged(true)}}/>
        <CssTextField error={!isPasswordValid()} helperText={getPasswordHelperText()} key={'password'} id="outlined-basic" label="Password" type="password" variant="outlined" value={password} onChange={(e) => {setPassword(e.target.value); setPasswordChanged(true)}}/>
        <Box>{message}</Box>
        <Box sx={{display: loading ? 'block' : 'none'}}><CircularProgress /></Box>
        <StyledButton variant="outlined" size="large" onClick={() => handleRegister()} disabled={!isUserNameValid() || !isPasswordValid()}>Register</StyledButton>
      </Box>
      <Box>
        OR
      </Box>
      <Box>
        <StyledButton variant="outlined" size="large" href="/login">Login</StyledButton>
      </Box>
    </Box>
  );
}

export default Register;