import { useState } from "react";
import { useCreateRoom, useGetRooms, useJoinRoom, useLeaveRoom } from "../../hooks/useRooms";

import { Box, Container, Divider, Typography } from "@mui/material";

import StyledButton from "../shared/StyledButton/StyledButton";
import StyledTextField from "../shared/StyledTextField/StyledTextField";

function Room() {
  const [roomName, setRoomName] = useState<string>("");
  const [roomPassword, setRoomPassword] = useState<string>("");

  const { mutateAsync: createRoom, error: createError } = useCreateRoom();
  const { mutate: joinRoom, error: joinError } = useJoinRoom();
  const { mutate: leaveRoom } = useLeaveRoom();
  const { data: roomData, isLoading: isLoadingRooms, isFetching: isFetchingRooms } = useGetRooms();

  const rooms = roomData ?? [];
  const isLoading = isLoadingRooms || isFetchingRooms;
  const errorMessages = [createError, joinError].filter((errorType) => errorType?.message);

  const handleCreateRoom = async () => {
    try {
      await createRoom({ roomName, roomPassword });
      clearInputs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinRoom = () => {
    joinRoom({ roomName, roomPassword });
    clearInputs();
  };

  const handleLeaveRoom = (roomId: string) => {
    leaveRoom({ roomId });
  };

  const clearInputs = () => {
    setRoomName("");
    setRoomPassword("");
  };

  const colors = ["#FF0087", "#FFF800", "#0043ff"];

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
        <Typography key={"title"} textAlign='center' fontFamily={"gotham-book"} fontSize={"30px"} color={"#FF0087"} fontWeight={600} mb={"16px"} textTransform={"uppercase"}>
          Party Rooms
        </Typography>
        <StyledTextField fieldKey={"roomName"} id='outlined-basic' label='Room name' value={roomName} onChange={(e) => setRoomName(e.target.value)} />
        <StyledTextField fieldKey={"roomPassword"} id='outlined-basic' label='Password' value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <StyledButton onClick={handleJoinRoom} disabled={isLoading}>
            Join
          </StyledButton>
          <StyledButton onClick={handleCreateRoom} disabled={isLoading}>
            Create
          </StyledButton>
        </Box>
        {errorMessages.map(
          (error) =>
            error && (
              <Box key={error.message} sx={{ my: "16px" }}>
                {error.message}
              </Box>
            )
        )}
        {isLoading && <p>Loading...</p>}
        {!isLoading && rooms.length > 0 && (
          <Box sx={{ width: "calc(100% - 32px)" }}>
            <Divider variant='middle' sx={{ mx: 0, borderColor: "#FF0087" }} />
            <Typography textAlign='left' fontFamily={"gotham-book"} fontSize={"30px"} color={"#FBF401"} fontWeight={600} my={"16px"} lineHeight={1}>
              Your Rooms
            </Typography>
            {rooms.map((room, index) => (
              <Box
                key={room.id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography textAlign='left' fontFamily={"gotham-book"} fontSize={"30px"} color={colors[index % 3]} fontWeight={600} my={"16px"} lineHeight={1.5}>
                    {index + 1}. {room.name}
                  </Typography>
                  <StyledButton onClick={() => handleLeaveRoom(room.id)}>Leave</StyledButton>
                </Box>
                <Divider variant='middle' sx={{ mx: 0, borderColor: colors[index % 3] }} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Room;
