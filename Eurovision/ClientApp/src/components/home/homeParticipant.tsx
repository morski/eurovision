import { FunctionComponent } from "react";

import IEurovisionEvent from "../../types/event.type";
import "./home.css";
import Participant from "../participant/participant";
import { Box, Container, Typography } from "@mui/material";
import IParticipant from "../../types/participant.type";

type Props = {
  participant: IParticipant,
  year: number
};

const HomeParticipant: FunctionComponent<Props> = ({ participant, year }) => {
    
    return (
        <Box sx={{borderRadius: '4px', backgroundColor: '#1D1B54', width: '400px', m: '8px', overflow: 'hidden', position: 'relative'}}>
            <Box component="img" src={`/images/${year}/participants/hero/${participant.country?.name?.toLowerCase().trim().replace(' ', '_')}-hero.jpeg`} alt="Eurovision Logo" sx={{height: '250px', width: '100%' }}/>
            <Box component="img"
                    className="flag"
                    src={`/images/flag/${participant.country?.name?.toLowerCase().trim().replace(' ', '_')}.svg`}
                    alt="country"
                    sx={{
                        width: '60px',
                        position: 'absolute', 
                        bottom: '16px', 
                        right: '16px'
                    }}
                />
            <Box sx={{m: '16px'}}>
                <Typography fontFamily={'gotham-book'} fontSize={'25px'} color={'#FFF'} fontWeight={600}>{participant.artist}</Typography>
                <Typography fontFamily={'gotham-book'} fontSize={'25px'} color={'#FFF'} fontWeight={400}>{participant.song}</Typography>
            </Box>
        </Box>
    )
}

export default HomeParticipant;