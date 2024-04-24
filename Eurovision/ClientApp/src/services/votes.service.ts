import IVote from "../types/vote.type";
import IVoteCategory from "../types/votecategory.type";
import requestService from "./request.service";

const BASE_URL = process.env.REACT_APP_BASE_URL ?? "";
const API_URL = BASE_URL + "api/vote/";

export const getVoteCategories = async (): Promise<IVoteCategory[]> => {
  const response = await requestService.sendApiRequest("GET", API_URL + "categories", null);
  return response.json();
};

export const updateVote = async (subcompetitionId: string, categoryId: string, participantId: string, voteAmount: number): Promise<IVote> => {
  const response = await requestService.sendApiRequest("PUT", API_URL + "update", {
    ParticipantId: participantId,
    VoteCategoryId: categoryId,
    SubCompetitionId: subcompetitionId,
    VoteAmount: voteAmount,
  });
  return response.json();
};
