import { Component } from "react";
import IParticipant from "../../types/participant.type";
import "./participant.css";

type Props = {
    participant: IParticipant
};

type State = {}


export default class Participant extends Component<Props, State> {
    render() {
        return (
            <div className="participant-card">
                <img 
                    src={`/images/2022/participants/card/${this.props.participant.country?.toLowerCase().replace(' ', '_')}-card.jpg`} 
                    alt="this.props.participant.country"
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src=`/images/2022/participants/placeholder-${Math.floor(Math.random() * 5) + 1}.webp`;
                    }}
                />
                <div className="flag-container">
                    <img className="flag" src={`/images/flag/${this.props.participant.country?.toLowerCase().replace(' ', '_')}.svg`} alt="country" />
                    <div>
                        {this.props.participant.country}
                    </div>
                </div>
                <div className="info">
                    <div className="name">
                        {this.props.participant.name}
                    </div>
                    <div className="song">
                        {this.props.participant.song}
                    </div>
                </div>
            </div>
        )
    }
}