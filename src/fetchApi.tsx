const BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface ExtendedRequestInit extends Omit<RequestInit, "body"> {
  body?: object | RequestInit["body"];
}

function fetchApi(path: string, init: ExtendedRequestInit = {}) {
  init.headers = {
    ...init.headers,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (init.body && typeof init.body === "object") {
    init.body = JSON.stringify(init.body);
  }
  return fetch(BASE_URL + path, init as RequestInit);
}

export default fetchApi;
