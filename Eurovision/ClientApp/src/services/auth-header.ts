export const authHeader = (): HeadersInit => {
  const token = localStorage.getItem("token");
  const requestHeaders: HeadersInit = new Headers();

  if (token) {
    requestHeaders.set("Authorization", "Bearer " + token);
  }

  requestHeaders.set("content-type", "application/json");
  return requestHeaders;
};

export const refreshAuthHeader = (): HeadersInit => {
  const refreshToken = localStorage.getItem("refreshToken");
  const requestHeaders: HeadersInit = new Headers();

  if (refreshToken) {
    requestHeaders.set("Authorization", "Bearer " + refreshToken);
  }

  requestHeaders.set("content-type", "application/json");
  return requestHeaders;
};
