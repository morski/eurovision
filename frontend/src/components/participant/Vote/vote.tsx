import { FunctionComponent, useState } from "react";
import IParticipant from "../../../types/participant.type";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { StarBorder } from "@mui/icons-material";

type Props = {
    participant: IParticipant,
};

const Vote: FunctionComponent<Props> = ({ participant }) => {
    return (
        <Box>
            <div>Vote Stuff - {participant.name}</div>
            <Rating name="customized-10" defaultValue={0} max={10} size="large" emptyIcon={	<StarBorder fontSize="inherit" sx={{ color: "white" }} />}/>
        </Box>
    );
};

export default Vote;