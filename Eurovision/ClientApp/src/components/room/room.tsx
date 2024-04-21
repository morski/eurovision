import { useEffect, useState } from "react";

import RoomService from "../../services/room.service";

import IRoom from "../../types/room.type";

import { Box, Container, Divider, Typography } from "@mui/material";

import StyledButton from "../shared/StyledButton/StyledButton";
import StyledTextField from "../shared/StyledTextField/StyledTextField";

function Room() {
  const [rooms, setRooms] = useState<Array<IRoom>>();
  const [roomName, setRoomName] = useState<string>("");
  const [roomPassword, setRoomPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    RoomService.GetRooms().then((res) => {
      if (res.ok) {
        res.json().then((res) => setRooms(res));
      } else {
        res.json().then((res) => setErrorMessage(res.message));
      }
    });
  }, []);

  const joinRoom = () => {
    RoomService.JoinRoom(roomName, roomPassword).then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          if (rooms) {
            const rc = [...rooms];
            rc.push(res);
            setRooms(rc);
          }
          clearInputs();
        });
      } else {
        res.json().then((res) => setErrorMessage(res.message));
      }
    });
  };

  const leaveRoom = (roomId: string) => {
    RoomService.LeaveRoom(roomId).then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          if (rooms) {
            const updatedRoomList = rooms.filter((room) => {
              return room.id !== roomId;
            });

            setRooms(updatedRoomList);
          }
        });
      } else {
        res.json().then((res) => setErrorMessage(res.message));
      }
    });
  };

  const createRoom = () => {
    RoomService.CreateRoom(roomName, roomPassword).then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          if (rooms) {
            const rc = [...rooms];
            rc.push(res);
            setRooms(rc);
          }
          clearInputs();
        });
      } else {
        res.json().then((res) => setErrorMessage(res.message));
      }
    });
  };

  const clearInputs = () => {
    setRoomName("");
    setRoomPassword("");
    setErrorMessage("");
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
        <Typography
          key={"title"}
          textAlign='center'
          fontFamily={"gotham-book"}
          fontSize={"30px"}
          color={"#FF0087"}
          fontWeight={600}
          mb={"16px"}
          textTransform={"uppercase"}
        >
          Party Rooms
        </Typography>
        <StyledTextField
          fieldKey={"roomName"}
          id='outlined-basic'
          label='Room name'
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <StyledTextField
          fieldKey={"roomPassword"}
          id='outlined-basic'
          label='Password'
          value={roomPassword}
          onChange={(e) => setRoomPassword(e.target.value)}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <StyledButton onClick={joinRoom}>Join</StyledButton>
          <StyledButton onClick={createRoom}>Create</StyledButton>
        </Box>
        {errorMessage !== "" && <Box sx={{ my: "16px" }}>{errorMessage}</Box>}
        {rooms && rooms.length > 0 && (
          <Box sx={{ width: "calc(100% - 32px)" }}>
            <Divider variant='middle' sx={{ mx: 0, borderColor: "#FF0087" }} />
            <Typography
              textAlign='left'
              fontFamily={"gotham-book"}
              fontSize={"30px"}
              color={"#FBF401"}
              fontWeight={600}
              my={"16px"}
              lineHeight={1}
            >
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
                  <Typography
                    textAlign='left'
                    fontFamily={"gotham-book"}
                    fontSize={"30px"}
                    color={colors[index % 3]}
                    fontWeight={600}
                    my={"16px"}
                    lineHeight={1.5}
                  >
                    {index + 1}. {room.name}
                  </Typography>
                  <StyledButton onClick={() => leaveRoom(room.id)}>
                    Leave
                  </StyledButton>
                </Box>
                <Divider
                  variant='middle'
                  sx={{ mx: 0, borderColor: colors[index % 3] }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Room;
