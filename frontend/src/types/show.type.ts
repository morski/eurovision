import IParticipant from "./participant.type";

export default interface IShow {
    id: string,
    name: string,
    date: string,
    active: boolean,
    type: number,
    participants: Array<IParticipant>
}