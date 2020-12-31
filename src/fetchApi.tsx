const BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000`;

function fetchApi(path: string, ...args: Array<any>) {
  return fetch(BASE_URL + path, ...args);
}

export default fetchApi;
