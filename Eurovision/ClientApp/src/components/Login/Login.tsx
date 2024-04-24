import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetActiveEventYear } from "../../hooks/useEvents";

import AuthService from "../../services/auth.service";

import { Box, CircularProgress, useMediaQuery } from "@mui/material";

import StyledButton from "../shared/StyledButton/StyledButton";
import StyledTextField from "../shared/StyledTextField/StyledTextField";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const {data: eventYear} = useGetActiveEventYear();

  const navigate = useNavigate();

  const handleLogin = () => {
    setMessage("");
    setLoading(true);

    AuthService.login(username, password)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
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
        err.json().then((error: any) => {
          setLoading(false);
          setMessage(error.error);
        });
      });
  };

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
        backgroundColor: "#1d1b54",
        borderRadius: "4px",
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
        {eventYear && (
          <Box
            component='img'
            src={`/images/${eventYear}/logo/eurovision_${eventYear}_white.png`}
            alt='logo'
            sx={{ maxWidth: "100%" }}
          />
        )}
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
          fieldKey={"username"}
          id='outlined-basic'
          label='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <StyledTextField
          fieldKey={"password"}
          id='outlined-basic'
          label='Password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box>{message}</Box>
        <Box sx={{ display: loading ? "block" : "none" }}>
          <CircularProgress />
        </Box>
        <StyledButton onClick={() => handleLogin()}>Login</StyledButton>
      </Box>
      <Box>OR</Box>
      <Box>
        <StyledButton href='/register'>Register</StyledButton>
      </Box>
    </Box>
  );
}

export default Login;
