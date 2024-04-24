import { useQuery } from "@tanstack/react-query";
import { EVENTS_QUERY_KEY } from "../constants";
import { getActiveEvent, getActiveEventYear, getEvent, getSubcompetition, getSubCompetitionResults } from "../services/events.service";

interface DefaultEventQueryProps {
  year: number;
}

interface SubcompetitionQueryProps extends DefaultEventQueryProps {
  showType: number;
}

interface SubcompetitionResultsQueryProps extends SubcompetitionQueryProps {
  roomId: string;
}

export const useGetEvent = ({ year }: DefaultEventQueryProps) =>
  useQuery({
    queryKey: [EVENTS_QUERY_KEY, year],
    queryFn: () => getEvent(year),
  });

export const useGetActiveEvent = () =>
  useQuery({
    queryKey: [EVENTS_QUERY_KEY],
    queryFn: getActiveEvent,
  });

export const useGetActiveEventYear = () =>
  useQuery({
    queryKey: [EVENTS_QUERY_KEY],
    queryFn: getActiveEventYear,
  });

export const useGetSubcompetition = ({ year, showType }: SubcompetitionQueryProps) =>
  useQuery({
    queryKey: [EVENTS_QUERY_KEY, year, showType],
    queryFn: () => getSubcompetition(year, showType),
  });

export const useGetSubcompetitionResults = ({ year, showType, roomId }: SubcompetitionResultsQueryProps) =>
  useQuery({
    queryKey: [EVENTS_QUERY_KEY, year, showType, roomId],
    queryFn: () => getSubCompetitionResults(year, showType, roomId),
    enabled: !!roomId,
  });
