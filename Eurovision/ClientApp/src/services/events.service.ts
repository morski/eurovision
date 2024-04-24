import IEurovisionEvent from "../types/event.type";
import ISubcompetition from "../types/subcompetition.type";
import { authHeader } from "./auth-header";
import requestService from "./request.service";

const BASE_URL = process.env.REACT_APP_BASE_URL ?? "";
const API_URL = BASE_URL + "api/eurovision/";

const saveEventToLocalStorage = (event: IEurovisionEvent) => {
  localStorage.setItem("activeEvent", JSON.stringify(event));
};

export const getEvent = async (year: number): Promise<IEurovisionEvent> => {
  const response = await requestService.sendApiRequest("GET", API_URL + "event/" + year, null);
  return response.json();
};

export const getActiveEvent = async (): Promise<IEurovisionEvent> => {
  const event = localStorage.getItem("activeEvent");
  if (event) {
    return JSON.parse(event);
  } else {
    return fetch(API_URL + "event/active", {
      headers: authHeader(),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((response) => {
        saveEventToLocalStorage(response as IEurovisionEvent);
        return response;
      });
  }
};

export const getActiveEventYear = async (): Promise<string | undefined> => {
  const response = await requestService.sendApiRequest("GET", API_URL + "event/active/year", null);
  return response.json();
};

export const getSubcompetition = async (year: number, showType: number): Promise<ISubcompetition> => {
  const response = await requestService.sendApiRequest("GET", API_URL + "subcompetition/" + year + "/" + showType + "?includeVotes=true", null);
  return response.json();
};

export const getSubCompetitionResults = async (year: number, showType: number, roomId: string): Promise<ISubcompetition> => {
  const response = await requestService.sendApiRequest("GET", API_URL + "subcompetition/" + year + "/" + showType + "/result/" + roomId, null);
  return response.json();
};
