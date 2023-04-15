import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/test/';

class UserService {
  getPublicContent() {
    var test = { data: "asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>asdasd<br>" };
    return new Promise<any>((res, rej) => {
        res(test)
    });
    //return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return fetch(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return fetch(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return fetch(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();