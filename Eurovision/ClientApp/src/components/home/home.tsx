import { FunctionComponent, useState } from "react";

import IEurovisionEvent from "../../types/event.type";
import "./home.css";
import Participant from "../participant/participant";
import { Box, Button, Container, Modal, TextField, Typography } from "@mui/material";
import roomService from "../../services/room.service";

type Props = {
  event: IEurovisionEvent
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: '#1d1b54',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Home: FunctionComponent<Props> = ({ event }) => {
  const [openJoin, setOpenJoin] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [joinRoomName, setJoinRoomName] = useState<string>('');
  const [joinRoomPassword, setJoinRoomPassword] = useState<string>('');
  const [createRoomName, setCreateRoomName] = useState<string>('');
  const [createRoomPassword, setCreateRoomPassword] = useState<string>('');

  if (!event.participants || !event.city || !event.country) {
    return <div />
  }

  const handleJoinClose = () => {
    setOpenJoin(false);
    setJoinRoomName('');
    setJoinRoomPassword('');
  }
  
  const handleCreateClose = () => {
    setOpenCreate(false);
    setCreateRoomName('');
    setCreateRoomPassword('');
  }
  

  return (
    <Container maxWidth='md' sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
      <Box sx={{borderRadius: '4px', backgroundColor: '#1D1B54', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Box component="img" src={`/images/logo/Eurovision_generic_white.png`} alt="Eurovision Logo" sx={{width: '75%', my: '32px'}} />
        <Box>
          <Typography textAlign="center" fontFamily={'gotham-book'} fontSize={'30px'} color={'#FF0087'} fontWeight={600} >{event.name.toUpperCase()}</Typography>
          <Typography textAlign="center" fontFamily={'gotham-book'} fontSize={'30px'} color={'#FFF800'} fontWeight={600} >{event.city.toUpperCase()}</Typography>
          <Typography textAlign="center" fontFamily={'gotham-book'} fontSize={'30px'} color={'#0043ff'} fontWeight={600} >{event.country.name.toUpperCase()}</Typography>
          <Typography textAlign="center" fontFamily={'gotham-book'} fontSize={'30px'} color={'#FF0087'} fontWeight={600}>{event.year}</Typography>
        </Box>
      </Box>
      <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
        <Button variant="contained" onClick={() => setOpenJoin(true)}>Join Room</Button>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>Create Room</Button>
          <Modal
          open={openJoin}
          onClose={handleJoinClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Join a room
            </Typography>
            <TextField id="outlined-basic" label="Room name" variant="outlined" onChange={(e) => setJoinRoomName(e.target.value)}/>
            <TextField id="outlined-basic" label="Password" variant="outlined" onChange={(e) => setJoinRoomPassword(e.target.value)}/>
            <Button variant="contained" onClick={() => roomService.joinRoom(joinRoomName, joinRoomPassword) }>Join Room</Button>
          </Box>
        </Modal>
        <Modal
          open={openCreate}
          onClose={handleCreateClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create a room
            </Typography>
            <TextField id="outlined-basic" label="Room name" variant="outlined" onChange={(e) => setCreateRoomName(e.target.value)}/>
            <TextField id="outlined-basic" label="Password" variant="outlined" onChange={(e) => setCreateRoomPassword(e.target.value)}/>
            <Button variant="contained" onClick={() => setOpenJoin(true)}>Create Room</Button>
          </Box>
        </Modal>
      </Box>
    </Container>
  )

}

export default Home;