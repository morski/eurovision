const API_URL = "http://localhost:8000/api/auth/";

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
    window.history.pushState({}, "", "/login");
    window.location.reload();
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
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();