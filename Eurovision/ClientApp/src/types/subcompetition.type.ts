import IParticipant from "./participant.type";


export default interface ISubcompetition {
    name: string,
    participants: Array<IParticipant>
}