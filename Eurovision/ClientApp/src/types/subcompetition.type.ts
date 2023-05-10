import IParticipant from "./participant.type";


export default interface ISubcompetition {
    id: string,
    name: string,
    participants: Array<IParticipant>
}