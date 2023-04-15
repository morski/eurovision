import { FunctionComponent, useState } from "react";
import IParticipant from "../../../types/participant.type";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { StarBorder } from "@mui/icons-material";
import Slider from "@mui/material/Slider";

type Props = {
    participant: IParticipant,
};

const Vote: FunctionComponent<Props> = ({ participant }) => {

    function valuetext(value: number) {
        return `${value}°C`;        
    }

    return (
        <Box>
            <div>Vote Stuff - {participant.name}</div>
            <Slider
                aria-label="Vote 1"
                defaultValue={0}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
            />
        </Box>
    );
};

export default Vote;