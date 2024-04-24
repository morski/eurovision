import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { VOTES_QUERY_KEY } from "../constants";
import { getVoteCategories, updateVote } from "../services/votes.service";

interface UpdateVoteQueryProps {
  subcompetitionId: string;
  categoryId: string;
  participantId: string;
  voteAmount: number;
}

export const useGetVoteCategories = () =>
  useQuery({
    queryKey: [VOTES_QUERY_KEY],
    queryFn: getVoteCategories,
  });

export const useUpdateVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subcompetitionId, categoryId, participantId, voteAmount }: UpdateVoteQueryProps) => updateVote(subcompetitionId, categoryId, participantId, voteAmount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VOTES_QUERY_KEY] });
    },
  });
};
