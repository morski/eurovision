import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetSubcompetitionResults } from "../../../hooks/useEvents";
import { useGetRooms } from "../../../hooks/useRooms";
import { useGetVoteCategories } from "../../../hooks/useVotes";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Card, CardContent, Collapse, Divider, IconButton, IconButtonProps, Tab, Typography, styled } from "@mui/material";
import Tabs, { tabsClasses } from "@mui/material/Tabs";

import IParticipant from "../../../types/participant.type";

import StyledButton from "../../shared/StyledButton/StyledButton";

type IResultViewProps = {
  showType: number;
  year: number;
};

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  color: "white",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function ResultView({ showType, year }: IResultViewProps) {
  const [expanded, setExpanded] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const { data: rooms } = useGetRooms();
  const { data: subcompetition } = useGetSubcompetitionResults({ year, showType, roomId: rooms != undefined && rooms.length != 0 ? rooms[selectedTab].id : "" });
  const participants = subcompetition ? [...subcompetition.participants] : [];
  const { data: voteCategories } = useGetVoteCategories();

  const nav = useNavigate();

  const colors = ["#64d7d6", "#eb54df", "#ea3323;"];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleChange = (panel: string) => {
    if (panel === expanded) {
      setExpanded("");
    } else {
      setExpanded(panel);
    }
  };

  const sortByTotalPoints = (a: IParticipant, b: IParticipant) => {
    const aTotal = a.votes.reduce((a, b) => a + b.amount, 0);
    const bTotal = b.votes.reduce((a, b) => a + b.amount, 0);
    return bTotal - aTotal;
  };

  const sortedParticipants = participants.length ? participants.sort(sortByTotalPoints) : [];

  if (rooms && rooms.length === 0) {
    return (
      <Box
        sx={{
          borderRadius: "12px",
          backgroundColor: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: "16px",
          py: "16px",
          width: "100%",
          border: "2px solid #eb54df",
        }}
      >
        <Typography textAlign='center' fontFamily={"gotham-book"} fontSize={"30px"} color={"#64d7d6"} fontWeight={600} mb={"16px"}>
          You have not yet joined any party rooms. Click below to join or create some party rooms!
        </Typography>
        <StyledButton onClick={() => nav("/rooms")}>
          Manage rooms
        </StyledButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "calc(100vh - 140px)",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "#000",
          borderRadius: "12px",
          mt: "16px",
          border: "2px solid " + colors[0]
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant='scrollable'
          scrollButtons
          aria-label='visible arrows tabs example'
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              "&.Mui-disabled": { opacity: 0.3 },
            },
            color: colors[1],
            "& .MuiTabs-indicator": {
              backgroundColor: colors[1],
            },
          }}
        >
          {rooms &&
            rooms.map((room, index) => (
              <Tab
                key={room.id}
                label={room.name}
                sx={{
                  color: "white",
                  fontFamily: "gotham-book",
                  "&.Mui-selected": { color: colors[1], fontWeight: 600 },
                }}
              />
            ))}
        </Tabs>
      </Box>
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
        <br />
        RESULTS
        <br />
        {rooms && rooms[selectedTab].name}
      </Box>
      <Box className='participants-container'>
        {voteCategories &&
          sortedParticipants.length &&
          sortedParticipants.map((participant, index) => (
            <Card
              sx={{
                width: "100%",
                backgroundColor: "#000",
                color: "white",
                position: "relative",
                marginBottom: "20px",
                border: "2px solid " + colors[index % 3],
                borderRadius: "12px"
              }}
              key={participant.id}
            >
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }} onClick={() => handleChange(`panel${index}`)}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                  }}
                >
                  {index + 1}
                  <Box
                    component='img'
                    className='flag'
                    src={`/images/flag/${participant.country?.name?.toLowerCase().trim().replace(" ", "_")}.svg`}
                    alt='country'
                    sx={{
                      width: "40px",
                      paddingLeft: "8px",
                    }}
                  />
                  {participant.country?.name}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: "30px",
                        fontWeight: "bold",
                      }}
                    >
                      {participant.votes.reduce((a, b) => a + b.amount, 0)}p
                    </Box>
                  </Box>
                  <ExpandMore expand={expanded === `panel${index}`} aria-expanded={expanded === `panel${index}`} aria-label='show more'>
                    <ExpandMoreIcon />
                  </ExpandMore>
                </Box>
              </CardContent>
              <Collapse in={expanded === `panel${index}`} timeout='auto' unmountOnExit>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "16px !important",
                  }}
                >
                  {voteCategories &&
                    voteCategories.map((category, index) => (
                      <Box
                        key={category.categoryId}
                        sx={{
                          width: "100%",
                          fontSize: "25px",
                          alignItems: "center",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>{category.name}</Box>
                        <Box>{participant.votes.find((v) => v.categoryId == category.categoryId)?.amount ?? 0}</Box>
                      </Box>
                    ))}
                  <Divider variant='middle' sx={{ mx: 0, borderColor: "#FF0087", my: "16px" }} />
                  {participant.userVotes
                    .sort((a, b) => b.voteAmount - a.voteAmount)
                    .map((uservote, index) => (
                      <Box
                        key={uservote.name}
                        sx={{
                          width: "100%",
                          fontSize: "25px",
                          alignItems: "center",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>{uservote.name}</Box>
                        <Box>{uservote.voteAmount}</Box>
                      </Box>
                    ))}
                </CardContent>
              </Collapse>
            </Card>
          ))}
      </Box>
    </Box>
  );
}

export default ResultView;
