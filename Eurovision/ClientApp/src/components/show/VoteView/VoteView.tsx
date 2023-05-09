import { FunctionComponent, useEffect, useState } from "react";
import Participant from "../../participant/participant";
import Box from "@mui/material/Box";
import VoteService from "../../../services/vote.service";
import ISubcompetition from "../../../types/subcompetition.type";
import IVoteCategory from "../../../types/votecategory.type";
import useMediaQuery from '@mui/material/useMediaQuery';
import ParticipantDesktop from "../../participant/participantDesktop";
import { Checkbox, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup } from "@mui/material";
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import IParticipant from "../../../types/participant.type";
import EventService from "../../../services/event.service";

type IVoteViewProps = {
    showType: number,
    year: number
};

const VoteView: FunctionComponent<IVoteViewProps> = ({ showType, year }) => {
    const [subcompetition, setSubcompetition] = useState<ISubcompetition>();
    const [voteCategories, setVoteCategories] = useState<Array<IVoteCategory>>();
    const [participants, setParticipants] = useState<Array<IParticipant>>();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<string>('');
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [order, setOrder] = useState<string>('start-order');
    const [filterChecked, setFilterChecked] = useState<boolean>(false);
  

  const handleChange =
    (panel: string) => {
      if(panel === expanded){
        setExpanded('');
      } else {
        setExpanded(panel);
      }
    };

  const toggleDrawer =
    (open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerOpen(open);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrder((event.target as HTMLInputElement).value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterChecked(event.target.checked);
  };

  useEffect(() => {
    if (year && showType && !loaded) {
      VoteService.getVoteCategories()
      .then(response => {
        setVoteCategories(response);
        EventService.getSubcompetition(year, showType)
        .then(subcompetition => {
          setSubcompetition(subcompetition);
          setLoaded(true);
          setParticipants([...subcompetition.participants]);
        });
      });
    }
  }, []);

  const sortParticipants = (a: IParticipant, b: IParticipant) => {
      if(order === 'country') {
        return a.country!.name.localeCompare(b.country!.name);
      }
      else {
        return a.order! - b.order!;
      }
  }
  
  const filterUnfinished = (participant: IParticipant) => {
    if(filterChecked) {
      return participant.votes.length < voteCategories!.length
    } else {
      return true;
    }
  }

  const mobile = useMediaQuery('(max-width:600px)');
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: 'calc(100vh - 160px)'
          }}>
            <IconButton sx={{display: drawerOpen ? 'none' : 'inline-flex', position: 'absolute', bottom: '75px', right: '20px', zIndex: '9999', backgroundColor: 'white', height: '50px', width: '50px'}} onClick={toggleDrawer(true)}>
                <SortRoundedIcon  />
            </IconButton>
            <Box sx={{fontSize: '24px', fontFamily: 'gotham-book', fontWeight: '600', textAlign: 'center', my: '16px'}}>
                {subcompetition?.name.toUpperCase()}
            </Box>
            <Box className="participants-container">
                {subcompetition && (<Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
                }}>
                {voteCategories && participants!.filter(filterUnfinished).sort(sortParticipants).map((item, index) =>
                    mobile ?
                    <Participant key={item.id} iParticipant={item} eventYear={year} expanded={expanded} setExpanded={handleChange} index={index} voteCategories={voteCategories} />
                    :
                    <ParticipantDesktop key={item.id} iParticipant={item} eventYear={year} expanded={expanded} setExpanded={handleChange} index={index} voteCategories={voteCategories} />
                )}
                </Box>)}
            </Box>
            <Drawer
                anchor={'right'}
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                PaperProps={{
                sx: {
                    backgroundColor: "#1d1b54",
                    color: 'white',
                    p: '16px'
                }
                }}
            >
                <FormControl>
                <FormLabel id="demo-radio-buttons-group-label" focused={false} sx={{color: 'white', fontSize: '24px', fontWeight: '600'}} >Order by</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="start-order"
                    name="radio-buttons-group"
                    value={order}
                    onChange={handleRadioChange}
                >
                    <FormControlLabel value='start-order' control={<Radio sx={{
                        '& .MuiSvgIcon-root': {
                        fontSize: 28,
                        color: 'white'
                        },
                    }} />} label='Starting order' />
                    <FormControlLabel value='country' control={<Radio sx={{
                        '& .MuiSvgIcon-root': {
                        fontSize: 28,
                        color: 'white'
                        },
                    }} />} label='Country' />
                </RadioGroup>
                <FormLabel id="demo-radio-buttons-group-label" focused={false} sx={{color: 'white', fontSize: '24px', fontWeight: '600', pt: '16px'}} >Filter</FormLabel>
                <FormControlLabel control={<Checkbox sx={{color: 'white', '&.Mui-checked': {color: 'white'}}} checked={filterChecked} onChange={handleFilterChange} />} label="Only unfinished" />
                </FormControl>
            </Drawer>
        </Box>
    );
}

export default VoteView;