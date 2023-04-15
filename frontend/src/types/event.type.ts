import IShow from "./show.type";
import IParticipant from "./participant.type";

export default interface IEurovisionEvent {
    id: string,
    year: number,
    location: string,
    active: boolean,
    country: string,
    shows: Array<IShow>,
    participants: Array<IParticipant>
  }