import { authHeader } from './auth-header';
import authService from './auth.service';

class RequestService {
    async sendApiRequest(method: string, apiUrl: string, payload: any): Promise<Response> {

        const request: RequestInit = {
            headers: authHeader(),
            mode: "cors",
            method: method,
        }

        if(payload) {
            request.body = JSON.stringify(payload)
        }

        return fetch(apiUrl, request)
        .then(async response => {
            if(response.status === 401) {
                return await authService.refreshToken()
                .then(async response => {
                    if(response) {
                        return await this.sendApiRequest(method, apiUrl, payload);
                    }
                    return new Response(null);
                });
            }
            if(!response.ok) {
              return response.json().then(err => Promise.reject(err));
            }
            else {
                return response;
            }
        })
    }
}

export default new RequestService();