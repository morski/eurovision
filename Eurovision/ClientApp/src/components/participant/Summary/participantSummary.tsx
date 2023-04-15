import { FunctionComponent, useState } from "react";
import IParticipant from "../../../types/participant.type";
import Box from '@mui/material/Box';

type Props = {
    participant: IParticipant,
    eventYear: number
};

const ParticipantSummary: FunctionComponent<Props> = ({ participant, eventYear }) => {
    return (
        <Box sx={{
            display: 'flex',
            flexGrow: 1
        }}>
            <Box sx={{
                alignItems: 'center',
                display: 'flex',
                width: '50px',
                justifyContent: 'center'
            }}>
                {participant.order}
            </Box>
            <Box sx={{
                position: 'relative'
            }}>
                <Box sx={{
                    width: '150px',
                    backgroundImage: `url(/images/${eventYear}/participants/card/${participant.country?.toLowerCase().replace(' ', '_')}-card.jpeg)`,
                    height: '100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                }}
                />
            </Box>
            <Box sx={{
                flex: '1 0 auto',
                marginLeft: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '25px'
                }}>
                    <Box component="img"
                        className="flag"
                        src={`/images/flag/${participant.country?.toLowerCase().replace(' ', '_')}.svg`}
                        alt="country"
                        sx={{
                            width: '40px'
                        }}
                    />
                    {participant.country}
                </Box>
                <Box>
                    <Box sx={{
                        fontSize: '30px',
                        fontWeight: '600'
                    }}>
                        {participant.name}
                    </Box>
                    <Box sx={{
                        fontSize: '25px'
                    }}>
                        {participant.song}
                    </Box>
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mx: '12px'
            }}>
                <Box>Total points</Box>
                <Box sx={{
                    my: '12px',
                    fontSize: '30px',
                    fontWeight: 'bold'
                }}>
                    10
                </Box>
                <Box>1/3 voted</Box>
            </Box>
        </Box>
    )
};

export default ParticipantSummary

