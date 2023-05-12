import ICountry from "./country.type";
import IUserVote from "./uservote.type";
import IVote from "./vote.type";

export default interface IParticipant {
    id: string,
    artist?: string,
    song?: string,
    order?: number,
    country?: ICountry,
    votes: Array<IVote>,
    userVotes: Array<IUserVote>
  }