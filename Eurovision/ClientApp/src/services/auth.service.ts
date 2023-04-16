import EventBus from "../common/EventBus";

const BASE_URL = process.env.REACT_APP_BASE_URL ?? "";
const API_URL = BASE_URL + "fake/auth/";

class AuthService {
  async login(username: string, password: string) {
    return fetch(API_URL + "signin", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        username,
        password
      })
    });
  }

  logout() {
    localStorage.removeItem("user");
    EventBus.dispatch("navigate", "/login");
  }

  register(username: string, password: string) {
    return fetch(API_URL + "signup", {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    else {
      this.logout();
    }
  }
}

export default new AuthService();