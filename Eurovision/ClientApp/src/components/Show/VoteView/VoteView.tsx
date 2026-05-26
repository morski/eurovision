import { useState } from "react";
import { useGetSubcompetition } from "../../../hooks/useEvents";
import { useGetVoteCategories } from "../../../hooks/useVotes";

import IParticipant from "../../../types/participant.type";

import { Box, Checkbox, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup } from "@mui/material";

import SortRoundedIcon from "@mui/icons-material/SortRounded";
import Participant from "../../Participant/Participant";

import { useGetSubcompetitionById } from "../../../hooks/useEvents";

type IVoteViewProps = {
    showType: number;
    year: number;
    subCompetitionId: string;
    order: string;
    handleRadioChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    filterChecked: boolean;
    handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function VoteView({ showType, year, subCompetitionId, order, handleRadioChange, filterChecked, handleFilterChange }: IVoteViewProps) {
  console.log("subCompetitionId:", subCompetitionId);
  const [expanded, setExpanded] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const { data: voteCategories } = useGetVoteCategories();
  const { data: subcompetition } = useGetSubcompetitionById(subCompetitionId);
  const participants = subcompetition ? [...subcompetition.participants] : [];

  const handleChange = (panel: string) => {
    if (panel === expanded) {
      setExpanded("");
    } else {
      setExpanded(panel);
    }
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

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

  const colors = ["var(--esc-cyan)", "var(--esc-pink)", "var(--esc-yellow)", "var(--esc-red)", "var(--esc-lime)"];

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
          color: "var(--esc-black)",
          border: "2px solid var(--esc-yellow)",
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
          fontWeight: "800",
          textAlign: "center",
          my: "16px",
          color: "var(--esc-white)",
          textTransform: "uppercase",
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
                    borderColor={colors[index % 3]}
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
            backgroundColor: "#000",
            color: "white",
            p: "16px",
            borderLeft: "1px solid var(--esc-border)",
          },
        }}
      >
        <FormControl>
          <FormLabel id='demo-radio-buttons-group-label' focused={false} sx={{ color: "var(--esc-cyan)", fontSize: "24px", fontWeight: "700" }}>
            Order by
          </FormLabel>
          <RadioGroup aria-labelledby='demo-radio-buttons-group-label' defaultValue='start-order' name='radio-buttons-group' value={order} onChange={handleRadioChange}>
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
              color: "var(--esc-pink)",
              fontSize: "24px",
              fontWeight: "700",
              pt: "16px",
            }}
          >
            Filter
          </FormLabel>
          <FormControlLabel control={<Checkbox sx={{ color: "white", "&.Mui-checked": { color: "white" } }} checked={filterChecked} onChange={handleFilterChange} />} label='Only unfinished' />
        </FormControl>
      </Drawer>
    </Box>
  );
}

export default VoteView;
