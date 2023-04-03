const authHeader = (): HeadersInit => {
    const userStr = localStorage.getItem("user");
    const requestHeaders: HeadersInit = new Headers();
    let user = null;
    if (userStr)
      user = JSON.parse(userStr);
  
    if (user && user.accessToken) {
      requestHeaders.set('Authorization', 'Bearer ' + user.accessToken);
    }

    return requestHeaders;
};

  export default authHeader;