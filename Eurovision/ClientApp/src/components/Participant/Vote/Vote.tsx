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
  const colors = ["#FF0087", "#FFF800", "#0043ff"];
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

  const handleChangeCommited = (value: number | Array<number>, categoryId: string) => {
    if (typeof value === "number") {
      updateVote({ subcompetitionId: subcompetition.id, categoryId, participantId: participant.id, voteAmount: value });
    }
  };

  return (
    <Box>
      {voteCategories.map((item, index) => (
        <div key={index}>
          <Box sx={{ color: colors[index], fontSize: "24px", fontWeight: "600" }}>{item.name}</Box>
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
              onChangeCommitted={(event: React.SyntheticEvent | Event, value: number | Array<number>) => handleChangeCommited(value, item.categoryId)}
              onChange={handleChange}
              name={item.categoryId}
            />
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
              {participant.votes.find((v) => v.categoryId == item.categoryId)?.amount ?? 0}
            </Box>
          </Box>
        </div>
      ))}
    </Box>
  );
}

export default Vote;
