// ResultView.tsx
// This component displays the results/leaderboard for a show (Semi Final 1/2 or Grand Final).
// It shows participants ranked by total points, with expandable cards showing vote breakdowns.
// Results can be viewed per room (group of friends voting together).

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetSubcompetitionResults } from "../../../hooks/useEvents";
import { useGetRooms } from "../../../hooks/useRooms";
import { useGetVoteCategories } from "../../../hooks/useVotes";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// Note: Button was removed as it was imported but never used
import { Box, Card, CardContent, Collapse, Divider, IconButton, IconButtonProps, Tab, Typography, styled } from "@mui/material";
import Tabs, { tabsClasses } from "@mui/material/Tabs";

import IParticipant from "../../../types/participant.type";
import StyledButton from "../../shared/StyledButton/StyledButton";

// Props passed into this component from the parent (Show.tsx)
type IResultViewProps = {
    showType: number;  // 1 = Semi Final 1, 2 = Semi Final 2, 3 = Grand Final
    year: number;      // The Eurovision year (e.g. 2026)
};

// Props for the expand/collapse arrow button on each participant card
interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;  // Whether the card is currently expanded
}

// Custom styled IconButton that rotates 180° when expanded
// This creates the animated arrow effect on the participant cards
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
    // Tracks which participant card is expanded ("panel0", "panel1", etc.), empty string = none
    const [expanded, setExpanded] = useState<string>("");

    // Tracks which room tab is currently selected (index into the rooms array)
    const [selectedTab, setSelectedTab] = useState<number>(0);

    // Fetch all rooms the user belongs to
    const { data: rooms } = useGetRooms();

    // Fetch results for the current show and selected room
    // Only fetch if rooms exist — uses the currently selected room's ID
    const { data: subcompetition } = useGetSubcompetitionResults({
        year,
        showType,
        roomId: rooms !== undefined && rooms.length !== 0 ? rooms[selectedTab].id : ""
    });

    // Copy participants array so we can sort it without mutating the original
    const participants = subcompetition ? [...subcompetition.participants] : [];

    // Fetch the vote categories (e.g. Song, Performance, Outfit)
    const { data: voteCategories } = useGetVoteCategories();

    const nav = useNavigate();

    // One color per vote category — cycles through with index % 3
    const colors = ["#64d7d6", "#eb54df", "#ea3323;"];

    // Called when the user switches between room tabs
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    // Toggles a participant card open/closed
    // Clicking an already-open card closes it, clicking a new one opens it
    const handleChange = (panel: string) => {
        if (panel === expanded) {
            setExpanded("");
        } else {
            setExpanded(panel);
        }
    };

    // Sorting function: sorts participants by their total vote points (highest first)
    const sortByTotalPoints = (a: IParticipant, b: IParticipant) => {
        const aTotal = a.votes.reduce((a, b) => a + b.amount, 0);
        const bTotal = b.votes.reduce((a, b) => a + b.amount, 0);
        return bTotal - aTotal;
    };

    const sortedParticipants = participants.length ? participants.sort(sortByTotalPoints) : [];

    // If the user hasn't joined any rooms yet, show a message prompting them to do so
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
            {/* Room tabs — one tab per room the user belongs to */}
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

            {/* Results heading showing the show name, "RESULTS" and the selected room name */}
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

            {/* List of participants sorted by total points */}
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
                                // Cycles through the 3 colors for card borders
                                border: "2px solid " + colors[index % 3],
                                borderRadius: "12px"
                            }}
                            key={participant.id}
                        >
                            {/* Card header: shows rank, flag, country name, total points and expand arrow */}
                            <CardContent
                                sx={{ display: "flex", justifyContent: "space-between" }}
                                onClick={() => handleChange(`panel${index}`)}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "30px",
                                    }}
                                >
                                    {/* Rank number (1st, 2nd, 3rd...) */}
                                    {index + 1}

                                    {/* Country flag — loaded from /images/flag/ folder as SVG
                      Filename is the country name lowercased with spaces replaced by underscores
                      e.g. "United Kingdom" → "united_kingdom.svg" */}
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

                                <Box sx={{ display: "flex" }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        {/* Total points: sum of all vote amounts across all categories */}
                                        <Box sx={{ fontSize: "30px", fontWeight: "bold" }}>
                                            {participant.votes.reduce((a, b) => a + b.amount, 0)}p
                                        </Box>
                                    </Box>

                                    {/* Animated expand/collapse arrow */}
                                    <ExpandMore
                                        expand={expanded === `panel${index}`}
                                        aria-expanded={expanded === `panel${index}`}
                                        aria-label='show more'
                                    >
                                        <ExpandMoreIcon />
                                    </ExpandMore>
                                </Box>
                            </CardContent>

                            {/* Expandable section showing vote breakdown per category and per user */}
                            <Collapse in={expanded === `panel${index}`} timeout='auto' unmountOnExit>
                                <CardContent
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        padding: "16px !important",
                                    }}
                                >
                                    {/* Vote breakdown by category (e.g. Song: 8, Performance: 10) */}
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
                                                <Box>
                                                    {participant.votes.find((v) => v.categoryId === category.categoryId)?.amount ?? 0}
                                                </Box>
                                            </Box>
                                        ))}

                                    {/* Divider line between category totals and individual user votes */}
                                    <Divider variant='middle' sx={{ mx: 0, borderColor: "#FF0087", my: "16px" }} />

                                    {/* Individual user votes sorted highest to lowest
                      Shows who in the room gave how many points to this participant */}
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