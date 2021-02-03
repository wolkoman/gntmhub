import {CandidateEntity, UserEntity} from "../util/mongo";

export function Modal({candidate, user}: {candidate: CandidateEntity, user: UserEntity}){
    return <div>
        <div>{candidate.name}</div>
        <img src={candidate.imageUrl}/>
        <div>Aktuelle Aktien: {user.stocks[candidate._id]}</div>
    </div>
}