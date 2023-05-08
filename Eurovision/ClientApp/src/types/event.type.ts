import IShow from "./show.type";
import IParticipant from "./participant.type";
import ICountry from "./country.type";

export default interface IEurovisionEvent {
    id: string,
    year: number,
    city: string,
    active: boolean,
    country: ICountry,
    name: string,
    shows: Array<IShow>,
    participants: Array<IParticipant>
  }