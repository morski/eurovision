import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ROOMS_QUERY_KEY } from "../constants";
import { getAllRooms, createRoom, joinRoom, leaveRoom } from "../services/rooms.service";

interface DefaultRoomQueryProps {
  roomName: string;
  roomPassword: string;
}

interface LeaveRoomQueryProps {
  roomId: string;
}

export const useGetRooms = () =>
  useQuery({
    queryKey: [ROOMS_QUERY_KEY],
    queryFn: getAllRooms,
  });

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomName, roomPassword }: DefaultRoomQueryProps) => createRoom(roomName, roomPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOMS_QUERY_KEY] });
    },
  });
};

export const useJoinRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomName, roomPassword }: DefaultRoomQueryProps) => joinRoom(roomName, roomPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOMS_QUERY_KEY] });
    },
  });
};

export const useLeaveRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId }: LeaveRoomQueryProps) => leaveRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOMS_QUERY_KEY] });
    },
  });
};
