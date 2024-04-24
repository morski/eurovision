import EventBus from "../common/EventBus";
import { refreshAuthHeader } from "./auth-header";

const BASE_URL = process.env.REACT_APP_BASE_URL ?? "";
const API_URL = BASE_URL + "api/auth/";

class AuthService {
  async login(username: string, password: string) {
    return fetch(API_URL + "login", {
      method: "POST",
      mode: "cors",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        username,
        password,
      }),
    });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    EventBus.dispatch("navigate", "/login");
  }

  register(username: string, password: string) {
    return fetch(API_URL + "register", {
      method: "POST",
      mode: "cors",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        username,
        password,
      }),
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    } else {
      this.logout();
    }
  }

  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      return fetch(API_URL + "refreshToken", {
        method: "GET",
        mode: "cors",
        headers: refreshAuthHeader(),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }

          EventBus.dispatch("logout");
        })
        .then((response) => {
          if (response.token) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("refreshToken", response.refreshToken);
            localStorage.setItem("user", JSON.stringify({ userId: response.userId, username: response.username }));
            return true;
          }
          return false;
        });
    }
    EventBus.dispatch("logout");
    return false;
  }
}

const authService = new AuthService();
export default authService;
