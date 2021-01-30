const BASE_URL = window.location.origin;

interface ExtendedRequestInit extends Omit<RequestInit, "body"> {
  body?: object | RequestInit["body"];
  query?: Record<string, string>;
}

function fetchApi(path: string, init: ExtendedRequestInit = {}) {
  let fullUrl = BASE_URL + path;

  init.headers = {
    ...init.headers,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (init.body && typeof init.body === "object") {
    init.body = JSON.stringify(init.body);
  }

  if (init.query) {
    const urlObject = new URL(fullUrl);
    urlObject.search = new URLSearchParams(init.query).toString();
    fullUrl = urlObject.toString();
  }

  return fetch(fullUrl, init as RequestInit);
}

export default fetchApi;
export { BASE_URL };
