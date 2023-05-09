import IRoom from '../types/room.type';
import { authHeader } from './auth-header';
import authService from './auth.service';

const BASE_URL = process.env.REACT_APP_BASE_URL ?? "";
const API_URL = BASE_URL + 'api/room/';

class RoomService {
    createRoom(roomName: string, password: string): Promise<IRoom> {
        return fetch(API_URL + "create", {
        headers: authHeader(),
        mode: "cors",
        body: JSON.stringify({
            roomName,
            password,
        })
        })
        .then(async response => {
        if(response.ok) {
            return response.json();
        }
        else {
            return await authService.refreshToken()
            .then(async response => {
                if(response) {
                    return await this.createRoom(roomName, password);
                }
            });
        }
        })
        .then(response => {
            return response;
        });
    }

    joinRoom(roomName: string, password: string): Promise<IRoom> {
        return fetch(API_URL + "join", {
        headers: authHeader(),
        mode: "cors",
        body: JSON.stringify({
            roomName,
            password,
        })
        })
        .then(async response => {
        if(response.ok) {
            return response.json();
        }
        else {
            return await authService.refreshToken()
            .then(async response => {
                if(response) {
                    return await this.joinRoom(roomName, password);
                }
            });
        }
        })
        .then(response => {
            return response;
        });
    }
}

export default new RoomService();