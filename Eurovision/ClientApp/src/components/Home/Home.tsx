import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import IEurovisionEvent from "../../types/event.type";
import IUser from "../../types/user.type";

import StyledButton from "../shared/StyledButton/StyledButton";
import { useGetRooms } from "../../hooks/useRooms";

import "./Home.css";

type HomeProps = {
  event: IEurovisionEvent;
  user: IUser;
};

function Home({ event, user }: HomeProps) {
  const nav = useNavigate();
  const isMissingEventInfo = !event.participants || !event.city || !event.country;

  const { data, isLoading, error } = useGetRooms();
  const rooms = data ?? [];

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: "16px",
          width: "100%",
        }}
      >
        <Box component='img' src={`/images/${event.year}/logo/eurovision_${event.year}_white.png`} alt='Eurovision Logo' sx={{ width: "75%" }} />
        {isLoading && <p>Loading...</p>}
        {!isLoading && (
          <Box sx={{ my: "16px" }}>
            <Typography textAlign='center' fontFamily={"gotham-book"} fontSize={"25px"} color={"#eb54df"} fontWeight={600} textTransform={"uppercase"}>
              Welcome {user.username}!
            </Typography>
          </Box>
        )}
        {!isLoading && !rooms.length && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {error ? (
              <p>Error loading rooms</p>
            ) : (
              <>
                <Typography textAlign='center' fontFamily={"gotham-book"} fontSize={"30px"} color={"#DD0087"} fontWeight={600}>
                  You have not yet joined any party rooms. Click below to join or create some party rooms!
                </Typography>
                <StyledButton onClick={() => nav("/rooms")}>Manage rooms</StyledButton>
              </>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Home;
