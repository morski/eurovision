import { FunctionComponent, useEffect, useState } from "react";
import IParticipant from "../../types/participant.type";
import "./participant.css";
import Box from '@mui/material/Box';
import Vote from "./Vote/vote";
import IVoteCategory from "../../types/votecategory.type";
import { Card, CardMedia, CardContent, Typography, CardActions, Collapse, IconButtonProps, styled, IconButton } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import ISubcompetition from "../../types/subcompetition.type";

type Props = {
    iParticipant: IParticipant,
    eventYear: number,
    expanded: string,
    setExpanded: (panel: string) => any,
    index: number,
    voteCategories: Array<IVoteCategory>,
    subcompetition: ISubcompetition
};

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    color: 'white',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));

const Participant: FunctionComponent<Props> = ({ iParticipant, eventYear, expanded, setExpanded, index, voteCategories, subcompetition }) => {
    const [participant, setParticipant] = useState<IParticipant>(iParticipant || '');

    return (
        <Card sx={{ width: '100%', backgroundColor: '#1d1b54', color: 'white', position: 'relative', marginBottom: '20px'}}>
            <CardContent sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px'}}>
                        {participant.order}
                    <Box component="img"
                        className="flag"
                        src={`/images/flag/${participant.country?.name?.toLowerCase().trim().replace(' ', '_')}.svg`}
                        alt="country"
                        sx={{
                            width: '40px',
                            paddingLeft: '8px'
                        }}
                    />
                    {participant.country?.name}
                </Box>
                <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mx: '12px'
                }}>
                    <Box sx={{
                        fontSize: '30px',
                        fontWeight: 'bold'
                    }}>
                        {participant.votes.reduce((a,b) => a + b.amount, 0)}p
                    </Box>
                </Box>
            </CardContent>
            <CardMedia
                component="img"
                height="200"
                image={`/images/${eventYear}/participants/hero/${participant.country?.name?.toLowerCase().trim().replace(' ', '_')}-hero.jpeg`}
                alt={participant.artist}
            />
            <CardContent sx={{display: 'flex', justifyContent: 'space-between', padding:'16px !important'}} onClick={() => setExpanded(`panel${index}`)}>
                <Box>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress 
                                variant="determinate"
                                value={participant.votes.length / voteCategories.length * 100}
                                color="secondary"
                                size={50}
                                thickness={4}
                            />
                            <Box
                                sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                }}
                            >
                                <Typography
                                variant="caption"
                                component="div"
                                color="white"
                                fontSize={20}
                                fontWeight={600}
                                >{`${participant.votes.length}/${voteCategories.length}`}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{paddingLeft: '16px'}}>
                            <Box sx={{
                            fontSize: '30px',
                            fontWeight: '600'
                            }}>
                                {participant.artist}
                            </Box>
                            <Box sx={{
                                fontSize: '25px'
                            }}>
                                {participant.song}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <ExpandMore
                    expand={expanded === `panel${index}`}
                    onClick={() => setExpanded(`panel${index}`)}
                    aria-expanded={expanded === `panel${index}`}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardContent>
            <Collapse in={expanded === `panel${index}`} timeout="auto" unmountOnExit>
                <CardContent>
                    <Vote subcompetition={subcompetition} participant={participant} updateParticipant={setParticipant}  voteCategories={voteCategories}/>
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default Participant;