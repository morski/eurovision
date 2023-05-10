import { Box, Card, CardContent, CardMedia, Collapse, IconButton, IconButtonProps, styled } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";

import VoteService from "../../../services/vote.service";
import EventService from "../../../services/event.service";

import ISubcompetition from "../../../types/subcompetition.type";
import IVoteCategory from "../../../types/votecategory.type";
import IParticipant from "../../../types/participant.type";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type IResultViewProps = {
    showType: number,
    year: number
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

const ResultView: FunctionComponent<IResultViewProps> = ({showType, year}) => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [subcompetition, setSubcompetition] = useState<ISubcompetition>();
    const [voteCategories, setVoteCategories] = useState<Array<IVoteCategory>>();
    const [participants, setParticipants] = useState<Array<IParticipant>>();
    const [expanded, setExpanded] = useState<string>('');
    
    useEffect(() => {
        if (year && showType && !loaded) {
            VoteService.getVoteCategories()
            .then(response => {
                setVoteCategories(response);
                EventService.getSubCompetitionResults(year, showType)
                .then(subcompetition => {
                    setSubcompetition(subcompetition);
                    setLoaded(true);
                    setParticipants([...subcompetition.participants]);
                });
            });
        }
    }, []);

    const handleChange =
    (panel: string) => {
      if(panel === expanded){
        setExpanded('');
      } else {
        setExpanded(panel);
      }
    };

    const sortByTotalPoints = (a: IParticipant, b: IParticipant) => {
        const aTotal = a.votes.reduce((a,b) => a + b.amount, 0);
        const bTotal = b.votes.reduce((a,b) => a + b.amount, 0);
        return bTotal - aTotal;
    }    

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: 'calc(100vh - 140px)'
          }}>
            <Box sx={{fontSize: '24px', fontFamily: 'gotham-book', fontWeight: '600', textAlign: 'center', my: '16px'}}>
                {subcompetition?.name.toUpperCase()} RESULTS
            </Box>
            <Box className="participants-container">
                {voteCategories && participants && participants.sort(sortByTotalPoints).map((participant, index) =>
                <Card sx={{ width: '100%', backgroundColor: '#1d1b54', color: 'white', position: 'relative', marginBottom: '20px'}} key={participant.id}>
                    <CardContent sx={{display: 'flex', justifyContent: 'space-between'}} onClick={() => handleChange(`panel${index}`)}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px'}}>
                                {index + 1}
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
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Box sx={{
                                    fontSize: '30px',
                                    fontWeight: 'bold'
                                }}>
                                    {participant.votes.reduce((a,b) => a + b.amount, 0)}p
                                </Box>
                            </Box>
                            <ExpandMore
                                expand={expanded === `panel${index}`}
                                aria-expanded={expanded === `panel${index}`}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </Box>
                            
                        </CardContent>
                        <Collapse in={expanded === `panel${index}`} timeout="auto" unmountOnExit>
                            <CardContent sx={{display: 'flex', flexDirection: 'column', padding:'16px !important'}}>
                                {voteCategories && voteCategories.map((category, index) => 
                                    <Box sx={{width: "100%", fontSize: "25px", alignItems: "center", display: "flex", justifyContent: "space-between"}}>
                                        <Box>
                                            {category.name}
                                        </Box>
                                        <Box>
                                            {participant.votes.find(v => v.categoryId == category.categoryId)?.amount ?? 0}
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Collapse>
                    </Card>
                )}
            </Box>
        </Box>
    );
}

export default ResultView;