import { Component } from "react";

import IEurovisionEvent from "../../types/event.type";
import "./home.css";
import Participant from "../participant/participant";

type Props = {
  event: IEurovisionEvent
};

type State = {};

export default class Home extends Component<Props, State> {

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <img src={`/images/${this.props.event.year}/logo/ESC2023_Ukraine_LIVERPOOL_RGB_White.svg`} alt="Eurovision Logo" />
          <img src={`/images/${this.props.event.year}/logo/the-sound-of-beauty.svg`} alt="The Sound of Beauty" />
        </header>
        <div className="card-container">
          {this.props.event.participants?.sort((a, b) => a.country!.localeCompare(b.country!, 'en', {'sensitivity': 'base'})).map((participant, index) =>
            <Participant key={index} participant={participant} />
          )}
        </div>
      </div>
    );
  }
}