import { authHeader } from "./auth-header";

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "";
const API_URL = BASE_URL + "api/eurovision/admin/";

class AdminService {
    addCountry(name: string, flag: string) {
        return fetch(API_URL + "country", {
            method: "POST",
            mode: "cors",
            headers: authHeader(),
            body: JSON.stringify({ name, flag }),
        });
    }

    addEvent(name: string, year: string, city: string, countryId: string) {
        return fetch(API_URL + "event", {
            method: "POST",
            mode: "cors",
            headers: authHeader(),
            body: JSON.stringify({ name, year, city, countryId }),
        });
    }

    addParticipant(artist: string, song: string, countryId: string, eventId: string) {
        return fetch(API_URL + "participant", {
            method: "POST",
            mode: "cors",
            headers: authHeader(),
            body: JSON.stringify({ artist, song, countryId, eventId }),
        });
    }
    saveParticipantOrder(subCompetitionId: string, participantIds: string[]) {
        return fetch(`${BASE_URL}api/eurovision/admin/order/${subCompetitionId}`, {
            method: "POST",
            mode: "cors",
            headers: authHeader(),
            body: JSON.stringify(participantIds),
        });
    }
    addSubCompetition(name: string, eventId: string) {
        return fetch(`${BASE_URL}api/eurovision/admin/subcompetition`, {
            method: "POST",
            mode: "cors",
            headers: authHeader(),
            body: JSON.stringify({ name, eventId }),
        });
    }

    setActiveEvent(eventId: string) {
        return fetch(`${BASE_URL}api/eurovision/admin/event/setactive/${eventId}`, {
            method: "PUT",
            mode: "cors",
            headers: authHeader(),
        });
    }
    getParticipantsByEvent(eventId: string) {
        return fetch(`${BASE_URL}api/eurovision/participants/${eventId}`, {
            method: "GET",
            mode: "cors",
            headers: authHeader(),
        });
    }

    assignParticipantToShow(participantId: string, subCompetitionId: string, performanceNr: number) {
        return fetch(`${BASE_URL}api/eurovision/admin/assignparticipant`, {
            method: "POST",
            mode: "cors",
            headers: authHeader(),
            body: JSON.stringify({ participantId, subCompetitionId, performanceNr }),
        });
    }
}

const adminService = new AdminService();
export default adminService;