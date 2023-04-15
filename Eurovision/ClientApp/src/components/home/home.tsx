import { FunctionComponent } from "react";

import IEurovisionEvent from "../../types/event.type";
import "./home.css";
import Participant from "../participant/participant";

type Props = {
  event: IEurovisionEvent
};

const Home: FunctionComponent<Props> = ({ event }) => {
  return (event ?
    <div className="container">
      <header className="jumbotron">
        <img src={`/images/${event.year}/logo/ESC2023_Ukraine_LIVERPOOL_RGB_White.svg`} alt="Eurovision Logo" />
      </header>
      <div className="card-container">
        SOME SHIT
      </div>
    </div>
    : <div></div>
  );
}

export default Home;