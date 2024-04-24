import IRoom from "../types/room.type";
import requestService from "./request.service";

const BASE_URL = process.env.REACT_APP_BASE_URL ?? "";
const API_URL = BASE_URL + "api/room/";

export const getAllRooms = async (): Promise<IRoom[]> => {
  const response = await requestService.sendApiRequest("GET", API_URL + "all", null);
  return response.json();
};

export const createRoom = async (name: string, password: string): Promise<IRoom> => {
  const response = await requestService.sendApiRequest("POST", API_URL + "create", {
    name,
    password,
  });
  return response.json();
};

export const joinRoom = async (name: string, password: string): Promise<IRoom> => {
  const response = await requestService.sendApiRequest("POST", API_URL + "join", {
    name,
    password,
  });
  return response.json();
};

export const leaveRoom = async (roomId: string): Promise<boolean> => {
  const response = await requestService.sendApiRequest("DELETE", API_URL + "leave/" + roomId, null);
  return response.json();
};
