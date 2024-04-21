import { useEffect, useState } from "react";

import EventService from "../../../services/event.service";
import VoteService from "../../../services/vote.service";

import IParticipant from "../../../types/participant.type";
import ISubcompetition from "../../../types/subcompetition.type";
import IVoteCategory from "../../../types/votecategory.type";

import {
  Box,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  useMediaQuery,
} from "@mui/material";

import SortRoundedIcon from "@mui/icons-material/SortRounded";
import Participant from "../../Participant/Participant";

type IVoteViewProps = {
  showType: number;
  year: number;
  order: string;
  handleRadioChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filterChecked: boolean;
  handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function VoteView({
  showType,
  year,
  order,
  handleRadioChange,
  filterChecked,
  handleFilterChange,
}: IVoteViewProps) {
  const [subcompetition, setSubcompetition] = useState<ISubcompetition>();
  const [voteCategories, setVoteCategories] = useState<Array<IVoteCategory>>();
  const [participants, setParticipants] = useState<Array<IParticipant>>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleChange = (panel: string) => {
    if (panel === expanded) {
      setExpanded("");
    } else {
      setExpanded(panel);
    }
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  useEffect(() => {
    if (year && showType && !loaded) {
      VoteService.getVoteCategories().then((response) => {
        setVoteCategories(response);
        EventService.getSubcompetition(year, showType).then(
          (subcompetition) => {
            if (subcompetition) {
              setSubcompetition(subcompetition);
              setLoaded(true);
              setParticipants([...subcompetition.participants]);
            }
          }
        );
      });
    }
  }, []);

  const sortParticipants = (a: IParticipant, b: IParticipant) => {
    if (order === "country") {
      return a.country!.name.localeCompare(b.country!.name);
    } else if (order === "points") {
      const aTotal = a.votes.reduce((a, b) => a + b.amount, 0);
      const bTotal = b.votes.reduce((a, b) => a + b.amount, 0);
      return bTotal - aTotal;
    } else {
      return a.order! - b.order!;
    }
  };

  const filterUnfinished = (participant: IParticipant) => {
    if (filterChecked) {
      return participant.votes.length < voteCategories!.length;
    } else {
      return true;
    }
  };

  const mobile = useMediaQuery("(max-width:600px)");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "calc(100vh - 140px)",
      }}
    >
      <IconButton
        sx={{
          display: drawerOpen ? "none" : "inline-flex",
          position: "absolute",
          bottom: "75px",
          right: "20px",
          zIndex: "9999",
          backgroundColor: "white",
          height: "50px",
          width: "50px",
        }}
        onClick={toggleDrawer(true)}
      >
        <SortRoundedIcon />
      </IconButton>
      <Box
        sx={{
          fontSize: "24px",
          fontFamily: "gotham-book",
          fontWeight: "600",
          textAlign: "center",
          my: "16px",
        }}
      >
        {subcompetition?.name.toUpperCase()}
      </Box>
      <Box className='participants-container'>
        {subcompetition && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {voteCategories &&
              participants!
                .filter(filterUnfinished)
                .sort(sortParticipants)
                .map((item, index) => (
                  <Participant
                    key={item.id}
                    iParticipant={item}
                    eventYear={year}
                    expanded={expanded}
                    setExpanded={handleChange}
                    index={index}
                    voteCategories={voteCategories}
                    subcompetition={subcompetition}
                  />
                ))}
          </Box>
        )}
      </Box>
      <Drawer
        anchor={"right"}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#1d1b54",
            color: "white",
            p: "16px",
          },
        }}
      >
        <FormControl>
          <FormLabel
            id='demo-radio-buttons-group-label'
            focused={false}
            sx={{ color: "white", fontSize: "24px", fontWeight: "600" }}
          >
            Order by
          </FormLabel>
          <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            defaultValue='start-order'
            name='radio-buttons-group'
            value={order}
            onChange={handleRadioChange}
          >
            <FormControlLabel
              value='start-order'
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 28,
                      color: "white",
                    },
                  }}
                />
              }
              label='Starting order'
            />
            <FormControlLabel
              value='country'
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 28,
                      color: "white",
                    },
                  }}
                />
              }
              label='Country'
            />
            <FormControlLabel
              value='points'
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 28,
                      color: "white",
                    },
                  }}
                />
              }
              label='Total points'
            />
          </RadioGroup>
          <FormLabel
            id='demo-radio-buttons-group-label'
            focused={false}
            sx={{
              color: "white",
              fontSize: "24px",
              fontWeight: "600",
              pt: "16px",
            }}
          >
            Filter
          </FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
                checked={filterChecked}
                onChange={handleFilterChange}
              />
            }
            label='Only unfinished'
          />
        </FormControl>
      </Drawer>
    </Box>
  );
}

export default VoteView;
