import { Box, Button, Container, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import IEurovisionEvent from "../../types/event.type";
import IRoom from "../../types/room.type";
import IUser from "../../types/user.type";

import RoomService from "../../services/room.service";

import "./Home.css";

type HomeProps = {
  event: IEurovisionEvent;
  user: IUser;
};

const StyledButton = styled(Button)({
  borderColor: "white",
  color: "white",
  fontFamily: "gotham-book",
  margin: "16px 0",
  "&:hover": {
    borderColor: "white",
  },
});

function Home({ event, user }: HomeProps) {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const nav = useNavigate();
  const isMissingEventInfo =
    !event.participants || !event.city || !event.country;

  useEffect(() => {
    RoomService.GetRooms().then((res) => {
      if (res.ok) {
        res.json().then((res) => setRooms(res));
      } else {
        res.json().then((res) => setErrorMessage(res));
      }
    });
  }, []);

  if (isMissingEventInfo) {
    return <div />;
  }

  return (
    <Container
      maxWidth='md'
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: "16px",
      }}
    >
      <Box
        sx={{
          borderRadius: "4px",
          backgroundColor: "#1D1B54",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: "16px",
          width: "100%",
        }}
      >
        <Box
          component='img'
          src={`/images/${event.year}/logo/eurovision_${event.year}_white.png`}
          alt='Eurovision Logo'
          sx={{ width: "75%" }}
        />
        <Box sx={{ my: "16px" }}>
          <Typography
            textAlign='center'
            fontFamily={"gotham-book"}
            fontSize={"25px"}
            color={"#FF0087"}
            fontWeight={600}
            textTransform={"uppercase"}
          >
            Welcome {user.username}!
          </Typography>
        </Box>
        {rooms.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              textAlign='center'
              fontFamily={"gotham-book"}
              fontSize={"30px"}
              color={"#DD0087"}
              fontWeight={600}
            >
              You have not yet joined any party rooms. Click below to join or
              create some party rooms!
            </Typography>
            <StyledButton
              variant='outlined'
              size='large'
              onClick={() => nav("/rooms")}
            >
              Manage rooms
            </StyledButton>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Home;
