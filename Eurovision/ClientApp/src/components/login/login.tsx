import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import AuthService from "../../services/auth.service";
import EventService from "../../services/event.service";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  styled,
  useMediaQuery,
} from "@mui/material";

import "./Login.css";

const CssTextField = styled(TextField)({
  paddingBottom: "16px",
  color: "white",
  width: "75%",
  fontFamily: "gotham-book",
  "& label.Mui-focused": {
    color: "white",
  },
  "& label": {
    color: "white",
    fontFamily: "gotham-book",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& .MuiOutlinedInput-root": {
    fontFamily: "gotham-book",
    "& fieldset": {
      borderColor: "white",
      color: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
      borderWidth: "2px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
    },
  },
});

const StyledButton = styled(Button)({
  borderColor: "white",
  color: "white",
  fontFamily: "gotham-book",
  margin: "16px 0",
  "&:hover": {
    borderColor: "white",
  },
});

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [eventYear, setEventYear] = useState<string>("");

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

  useEffect(() => {
    const getEventYear = async () => {
      const year = await EventService.getActiveEventYear();
      if (year) {
        setEventYear(year);
      }
    };

    getEventYear();
  }, []);

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
        <CssTextField
          key={"username"}
          id='outlined-basic'
          label='Username'
          variant='outlined'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <CssTextField
          key={"password"}
          id='outlined-basic'
          label='Password'
          type='password'
          variant='outlined'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box>{message}</Box>
        <Box sx={{ display: loading ? "block" : "none" }}>
          <CircularProgress />
        </Box>
        <StyledButton
          variant='outlined'
          size='large'
          onClick={() => handleLogin()}
        >
          Login
        </StyledButton>
      </Box>
      <Box>OR</Box>
      <Box>
        <StyledButton variant='outlined' size='large' href='/register'>
          Register
        </StyledButton>
      </Box>
    </Box>
  );
}

export default Login;
