import IRoom from '../types/room.type';
import { authHeader } from './auth-header';
import authService from './auth.service';
import requestService from './request.service';

const BASE_URL = process.env.REACT_APP_BASE_URL ?? "";
const API_URL = BASE_URL + 'api/room/';

class RoomService {
    CreateRoom(name: string, password: string): Promise<Response> {
        const payload = {
            name,
            password,
        }

        return requestService.sendApiRequest("POST", API_URL + "create", payload);
    }

    async JoinRoom(name: string, password: string): Promise<Response> {
        const payload = {
            name,
            password,
        }

        return requestService.sendApiRequest("POST", API_URL + "join", payload);
    }

    async LeaveRoom(roomId: string): Promise<Response> {
        return requestService.sendApiRequest("DELETE", API_URL + "leave/" + roomId, null);
    }

    async GetRooms(): Promise<Response> {
        return requestService.sendApiRequest("GET", API_URL + "all", null);
    }
}

export default new RoomService();