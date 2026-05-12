import { useUpdateVote } from "../../../hooks/useVotes";

import IParticipant from "../../../types/participant.type";
import ISubcompetition from "../../../types/subcompetition.type";
import IVote from "../../../types/vote.type";
import IVoteCategory from "../../../types/votecategory.type";

import { Box, Slider } from "@mui/material";

type VoteProps = {
  subcompetition: ISubcompetition;
  participant: IParticipant;
  voteCategories: Array<IVoteCategory>;
  updateParticipant: React.Dispatch<React.SetStateAction<IParticipant>>;
};

function Vote({ subcompetition, participant, voteCategories, updateParticipant }: VoteProps) {
  const { mutate: updateVote } = useUpdateVote();
  const colors = ["var(--esc-cyan)", "var(--esc-pink)", "var(--esc-yellow)", "var(--esc-red)", "var(--esc-lime)"];
  const points = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  function valuetext(value: number) {
    return `${value}°C`;
  }

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      const categoryId = (event.target as HTMLInputElement).name;
      const vote = participant.votes.find((v) => v.categoryId === categoryId);
      if (vote !== undefined) {
        vote.amount = newValue;
      } else {
        const newVote: IVote = {
          amount: newValue,
          categoryId: categoryId,
        };
        participant.votes.push(newVote);
      }
      updateParticipant({ ...participant });
    }
  };

  function isTouchScreen() {
    const isTouchScreen = 'ontouchstart' in window || (navigator.maxTouchPoints & 0xFF) > 0;
    return isTouchScreen;
  }

  const handleChangeCommited = (event: React.SyntheticEvent | Event, value: number | Array<number>, categoryId: string) => {
    if (isTouchScreen() && event.type == 'mouseup') {
      return;
    }

    if (typeof value === "number") {
      updateVote({ subcompetitionId: subcompetition.id, categoryId, participantId: participant.id, voteAmount: value });
    }
  };

  return (
    <Box>
      {voteCategories.map((item, index) => (
        <div key={index}>
          <Box sx={{ color: colors[index % colors.length], fontSize: "22px", fontWeight: "800", textTransform: "uppercase" }}>{item.name}</Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Slider
              aria-label='Vote 1'
              value={participant.votes.find((v) => v.categoryId == item.categoryId)?.amount ?? 0}
              defaultValue={0}
              getAriaValueText={valuetext}
              valueLabelDisplay='off'
              step={null}
              marks={points.map((num) => ({ value: num }))}
              min={1}
              max={12}
              onChangeCommitted={(event: React.SyntheticEvent | Event, value: number | Array<number>) => handleChangeCommited(event, value, item.categoryId)}
              onChange={handleChange}
              name={item.categoryId}
              sx={{
                color: colors[index % colors.length],
                "& .MuiSlider-rail": {
                  color: "rgba(255, 255, 255, 0.28)",
                },
                "& .MuiSlider-thumb": {
                  border: "3px solid var(--esc-white)",
                  boxShadow: "0 0 0 6px rgba(255, 255, 255, 0.12)",
                },
                "& .MuiSlider-mark": {
                  backgroundColor: "rgba(255, 255, 255, 0.55)",
                  height: 7,
                  width: 7,
                  borderRadius: "50%",
                },
              }}
            />
            <Box
              sx={{
                width: "50px",
                textAlign: "center",
                fontSize: "25px",
                fontWeight: 800,
                color: "var(--esc-white)",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                paddingLeft: "16px",
              }}
            >
              {participant.votes.find((v) => v.categoryId == item.categoryId)?.amount ?? 0}
            </Box>
          </Box>
        </div>
      ))}
    </Box>
  );
}

export default Vote;
