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
          borderRadius: "8px",
          background: "var(--esc-panel)",
          border: "1px solid var(--esc-border)",
          boxShadow: "var(--esc-shadow)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: { xs: "28px", md: "40px" },
          px: { xs: "18px", md: "42px" },
          width: "100%",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, var(--esc-pink), var(--esc-cyan), var(--esc-yellow), var(--esc-red))",
          },
        }}
      >
        <Box component='img' src={`/images/${event.year}/logo/eurovision_${event.year}_white.png`} alt='Eurovision Logo' sx={{ width: { xs: "88%", md: "64%" }, maxWidth: "520px" }} />
        {isLoading && <p>Loading...</p>}
        {!isLoading && (
          <Box sx={{ my: "16px" }}>
            <Typography textAlign='center' fontFamily={"gotham-book"} fontSize={"25px"} color={"var(--esc-cyan)"} fontWeight={700} textTransform={"uppercase"}>
              Welcome {user.username}!
            </Typography>
            <Typography textAlign='center' fontFamily={"gotham-book"} fontSize={"16px"} color={"var(--esc-muted)"} fontWeight={600} textTransform={"uppercase"}>
              {event.city}, {event.country.name} {event.year}
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
                <Typography textAlign='center' fontFamily={"gotham-book"} fontSize={{ xs: "24px", md: "30px" }} color={"var(--esc-white)"} fontWeight={700}>
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
