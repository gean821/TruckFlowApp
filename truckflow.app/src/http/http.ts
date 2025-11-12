import axios from "axios";

const http = axios.create(
    { baseURL: 'https://localhost:56610/v1/',
      headers: {'X-Custom-Header': 'foobar'}
    });

export default http;




