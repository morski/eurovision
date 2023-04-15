import { FunctionComponent, useState } from "react";
import IParticipant from "../../types/participant.type";
import "./participant.css";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ParticipantSummary from "./Summary/participantSummary";
import Vote from "./Vote/vote";

type Props = {
    participant: IParticipant,
    eventYear: number,
    expanded: string | false,
    setExpanded: (panel: string) => any,
    index: number
};

const Participant: FunctionComponent<Props> = ({ participant, eventYear, expanded, setExpanded, index }) => {
    return (
        <Box sx={{
            mb: '12px',
            display: 'flex',
            width: '100%',
            borderRadius: '12px'
        }}>
            <Accordion expanded={expanded === `panel${index}`} onChange={setExpanded(`panel${index}`)} sx={{
                backgroundColor: '#1d1b54',
                color: 'white',
                width: '100%',
            }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <ParticipantSummary participant={participant} eventYear={eventYear} />
                </AccordionSummary>
                <AccordionDetails>
                    <Vote participant={participant} />
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}

export default Participant;