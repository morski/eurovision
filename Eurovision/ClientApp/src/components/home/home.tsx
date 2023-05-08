import { FunctionComponent } from "react";

import IEurovisionEvent from "../../types/event.type";
import "./home.css";
import Participant from "../participant/participant";
import { Box, Container, Typography } from "@mui/material";
import HomeParticipant from "./homeParticipant";

type Props = {
  event: IEurovisionEvent
};

const Home: FunctionComponent<Props> = ({ event }) => {
  if (!event.participants || !event.city || !event.country) {
    return <div />
  }

  return (
    <Container maxWidth='md' sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
      <Box sx={{borderRadius: '4px', backgroundColor: '#1D1B54', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Box component="img" src={`/images/logo/Eurovision_generic_white.png`} alt="Eurovision Logo" sx={{width: '75%', my: '32px'}} />
        <Box>
          <Typography textAlign="center" fontFamily={'gotham-book'} fontSize={'30px'} color={'#FF0087'} fontWeight={600} >{event.name.toUpperCase()}</Typography>
          <Typography textAlign="center" fontFamily={'gotham-book'} fontSize={'50px'} color={'#FFF800'} fontWeight={600} >{event.city.toUpperCase()}</Typography>
          <Typography textAlign="center" fontFamily={'gotham-book'} fontSize={'40px'} color={'#0043ff'} fontWeight={600} >{event.country.name.toUpperCase()}</Typography>
          <Typography textAlign="center" fontFamily={'gotham-book'} fontSize={'50px'} color={'#FF0087'} fontWeight={600}>{event.year}</Typography>
        </Box>
      </Box>
      <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
        {event.participants.sort((a, b) => a.country!.name.localeCompare(b.country!.name)).map((participant, index) => 
          <HomeParticipant participant={participant} year={event.year} key={index} />
        )}
      </Box>
    </Container>
  )

}

export default Home;