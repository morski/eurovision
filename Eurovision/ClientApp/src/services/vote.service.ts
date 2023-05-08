import EventBus from '../common/EventBus';
import IEurovisionEvent from '../types/event.type';
import IVote from '../types/vote.type';
import IVoteCategory from '../types/votecategory.type';
import { authHeader } from './auth-header';
import authService from './auth.service';

const BASE_URL = process.env.REACT_APP_BASE_URL ?? "";
const API_URL = BASE_URL + 'api/vote/';

class VoteService {
    getVoteCategories(): Promise<Array<IVoteCategory>> {
        return fetch(API_URL + "categories", {
        headers: authHeader(),
        mode: "cors",
        })
        .then(async response => {
        if(response.ok) {
            return response.json();
        }
        else {
            return await authService.refreshToken()
            .then(async response => {
                if(response) {
                    return await this.getVoteCategories();
                }
            });
        }
        })
        .then(response => {
            return response;
        });
    }

    updateVote(categoryId: string, participantId: string, voteAmount: number): Promise<IVote>{
        return fetch(API_URL + "update", {
            headers: authHeader(),
            mode: "cors",
            method: "PUT",
            body: JSON.stringify({ ParticipantId: participantId, VoteCategoryId: categoryId, VoteAmount: voteAmount})
        })
        .then(async response => {
            if(response.ok) {
                return response.json();
            }
            else {
                return await authService.refreshToken()
                .then(async response => {
                    if(response) {
                        return await this.updateVote(categoryId, participantId, voteAmount);
                    }
                });
            }
        })
        .then(response => {
            return response;
        });
    }
}

export default new VoteService();