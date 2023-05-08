import { FunctionComponent, useState } from "react";
import IParticipant from "../../../types/participant.type";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { StarBorder } from "@mui/icons-material";
import Slider from "@mui/material/Slider";
import IVoteCategory from "../../../types/votecategory.type";
import IVote from "../../../types/vote.type";
import { number } from "yup";
import voteService from "../../../services/vote.service";

type Props = {
    participant: IParticipant,
    voteCategories: Array<IVoteCategory>
    updateParticipant: React.Dispatch<React.SetStateAction<IParticipant>>
};

const Vote: FunctionComponent<Props> = ({ participant, voteCategories, updateParticipant }) => {

    function valuetext(value: number) {
        return `${value}°C`;        
    }

    const handleChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            const categoryId = (event.target as HTMLInputElement).name;
            voteService.updateVote(categoryId, participant.id, newValue);
            const vote = participant.votes.find(v => v.categoryId == categoryId);
            if(vote != undefined) {
                console.log(vote);
                vote.amount = newValue;
                
            }
            else {
                const newVote: IVote = {
                    amount: newValue,
                    categoryId: categoryId
                };
                participant.votes.push(newVote);
            }
            updateParticipant({...participant}  );
        }
    }

    const colors = [
        "#FF0087",
        "#FFF800",
        "#0043ff"
    ]

    return (
        <Box>
            {voteCategories.map((item, index) =>
            <div key={index}>
                <Box sx={{color: colors[index], fontSize: '24px', fontWeight: '600'}}>
                    {item.name}
                </Box>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    <Slider
                    aria-label="Vote 1"
                    value={participant.votes.find(v => v.categoryId == item.categoryId)?.amount ?? 0}
                    defaultValue={0}
                    getAriaValueText={valuetext}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={10}
                    onChange={handleChange}
                    name={item.categoryId}
                    />
                    <Box sx={{width: "50px", textAlign: "center", fontSize: "25px", alignItems: "center", display: "flex", justifyContent: "center", paddingLeft: '16px'}}>
                        {participant.votes.find(v => v.categoryId == item.categoryId)?.amount ?? 0}
                    </Box>
                </Box>
            </div>
            )}            
        </Box>
    );
};

export default Vote;