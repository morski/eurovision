import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetActiveEventYear } from "../../hooks/useEvents";

import AuthService from "../../services/auth.service";

import { Box, CircularProgress, useMediaQuery } from "@mui/material";

import StyledButton from "../shared/StyledButton/StyledButton";
import StyledTextField from "../shared/StyledTextField/StyledTextField";

function Register() {
  const [loading, setLoading] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [usernameChanged, setUsernameChanged] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [passwordChanged, setPasswordChanged] = useState<boolean>(false);

  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const { data: eventYear } = useGetActiveEventYear();

  const handleRegister = () => {
    if (username.length === 0 || password.length === 0) {
      setUsernameChanged(true);
      setPasswordChanged(true);
      return;
    }
    setMessage("");
    setLoading(true);

    AuthService.register(username, password)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          response.json().then((err) => {
            setMessage(err.error);
            setLoading(false);
          });
        }
      })
      .then((response) => {
        if (response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("refreshToken", response.refreshToken);
          localStorage.setItem(
            "user",
            JSON.stringify({
              userId: response.userId,
              username: response.username,
            })
          );
          navigate("/");
        }
      })
      .catch((err) => {
        const resMessage = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();

        setMessage(resMessage);
      });
  };

  const isUserNameValid = () => (username.length > 0 || !usernameChanged ? true : false);
  const getUsernameHelperText = () => (username.length > 0 || !usernameChanged ? "" : "Username is empty");
  const isPasswordValid = () => (password.length > 0 || !passwordChanged ? true : false);
  const getPasswordHelperText = () => (password.length > 0 || !passwordChanged ? "" : "Password is empty");

  const colors = ["#64d7d6", "#eb54df", "#ea3323;"];

  const mobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        justifyContent: "center",
        alignItems: "center",
        width: "calc(100% - 40px)",
        maxWidth: "900px",
        backgroundColor: "#000",
        borderRadius: "12px",
        border: "2px solid " + colors[0],
        fontFamily: "gotham-book",
        py: "16px",
      }}
    >
      <Box
        sx={{
          maxWidth: mobile ? "100%" : "75%",
          justifyContent: "center",
          paddingBottom: "16px",
          px: "16px",
        }}
      >
        {eventYear && <Box component='img' src={`/images/${eventYear}/logo/eurovision_${eventYear}_white.png`} alt='logo' sx={{ maxWidth: "100%" }} />}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <StyledTextField
          error={!isUserNameValid()}
          helperText={getUsernameHelperText()}
          fieldKey={"username"}
          id='username'
          label='Username'
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameChanged(true);
          }}
        />
        <StyledTextField
          error={!isPasswordValid()}
          helperText={getPasswordHelperText()}
          fieldKey={"password"}
          id='password'
          label='Password'
          type='password'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordChanged(true);
          }}
        />
        <Box>{message}</Box>
        <Box sx={{ display: loading ? "block" : "none" }}>
          <CircularProgress />
        </Box>
        <StyledButton onClick={() => handleRegister()} disabled={!isUserNameValid() || !isPasswordValid()}>
          Register
        </StyledButton>
      </Box>
      <Box>OR</Box>
      <Box>
        <StyledButton href='/login'>Login</StyledButton>
      </Box>
    </Box>
  );
}

export default Register;
