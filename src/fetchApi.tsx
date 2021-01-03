const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function fetchApi(path: string, ...args: Array<any>) {
  return fetch(BASE_URL + path, ...args);
}

export default fetchApi;
