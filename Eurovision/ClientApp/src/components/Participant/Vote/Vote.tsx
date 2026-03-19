// Vote.tsx
// This component renders the voting sliders for a single participant.
// Each vote category (e.g. Song, Performance, Outfit) gets its own slider.
// Votes are saved automatically when the user stops dragging the slider.

import { useUpdateVote } from "../../../hooks/useVotes";
import IParticipant from "../../../types/participant.type";
import ISubcompetition from "../../../types/subcompetition.type";
import IVote from "../../../types/vote.type";
import IVoteCategory from "../../../types/votecategory.type";
import { Box, Slider } from "@mui/material";

// Props passed into this component from the parent
type VoteProps = {
    subcompetition: ISubcompetition;   // The current show (Semi Final 1/2 or Grand Final)
    participant: IParticipant;          // The country/artist being voted on
    voteCategories: Array<IVoteCategory>; // List of categories to vote on (e.g. Song, Performance)
    updateParticipant: React.Dispatch<React.SetStateAction<IParticipant>>; // Callback to update parent state
};

function Vote({ subcompetition, participant, voteCategories, updateParticipant }: VoteProps) {
    // updateVote sends the vote to the backend API
    const { mutate: updateVote } = useUpdateVote();

    // One color per vote category — supports up to 3 categories
    const colors = ["#64d7d6", "#eb54df", "#ea3323;"];

    // The allowed point values on the slider (Eurovision style: 1-12)
    const points = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // Required by MUI Slider for accessibility labels
    function valuetext(value: number) {
        return `${value}°C`;
    }

    // Called every time the slider moves — updates the local state immediately
    // so the UI feels responsive, without saving to the backend yet
    const handleChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === "number") {
            // Get the category ID from the slider's name attribute
            const categoryId = (event.target as HTMLInputElement).name;

            // Check if a vote for this category already exists
            const vote = participant.votes.find((v) => v.categoryId === categoryId);

            if (vote !== undefined) {
                // Update the existing vote amount
                vote.amount = newValue;
            } else {
                // Create a new vote entry for this category
                const newVote: IVote = {
                    amount: newValue,
                    categoryId: categoryId,
                };
                participant.votes.push(newVote);
            }

            // Spread operator creates a new object reference so React detects the change
            updateParticipant({ ...participant });
        }
    };

    // Detects if the user is on a touch screen device (phone/tablet)
    // This is used to prevent double-saving votes on touch devices,
    // since touch screens fire both 'touchend' and 'mouseup' events
    function isTouchScreen() {
        const isTouchScreen = 'ontouchstart' in window || (navigator.maxTouchPoints & 0xFF) > 0;
        return isTouchScreen;
    }

    // Called when the user releases the slider — this is when we save to the backend
    const handleChangeCommited = (
        event: React.SyntheticEvent | Event,
        value: number | Array<number>,
        categoryId: string
    ) => {
        // On touch screens, ignore the mouseup event to avoid saving twice
        if (isTouchScreen() && event.type === 'mouseup') {
            return;
        }

        if (typeof value === "number") {
            // Send the vote to the backend API
            updateVote({
                subcompetitionId: subcompetition.id,
                categoryId,
                participantId: participant.id,
                voteAmount: value
            });
        }
    };

    return (
        <Box>
            {/* Render one slider per vote category */}
            {voteCategories.map((item, index) => (
                <div key={index}>
                    {/* Category name displayed in its assigned color */}
                    <Box sx={{ color: colors[index], fontSize: "24px", fontWeight: "600" }}>
                        {item.name}
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        {/* The voting slider — snaps to whole numbers between 1 and 12 */}
                        <Slider
                            aria-label='Vote 1'
                            // Current value: find the vote for this category, default to 0
                            value={participant.votes.find((v) => v.categoryId === item.categoryId)?.amount ?? 0}
                            defaultValue={0}
                            getAriaValueText={valuetext}
                            valueLabelDisplay='off'
                            step={null}  // null means it only snaps to the marks defined below
                            marks={points.map((num) => ({ value: num }))}
                            min={1}
                            max={12}
                            onChangeCommitted={(event, value) => handleChangeCommited(event, value, item.categoryId)}
                            onChange={handleChange}
                            name={item.categoryId}
                            sx={{ color: colors[index] }}
                        />

                        {/* Displays the current vote value as a number next to the slider */}
                        <Box
                            sx={{
                                width: "50px",
                                textAlign: "center",
                                fontSize: "25px",
                                alignItems: "center",
                                display: "flex",
                                justifyContent: "center",
                                paddingLeft: "16px",
                            }}
                        >
                            {participant.votes.find((v) => v.categoryId === item.categoryId)?.amount ?? 0}
                        </Box>
                    </Box>
                </div>
            ))}
        </Box>
    );
}

export default Vote;