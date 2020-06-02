import axios from 'axios';

const controller = axios.create({
  baseURL: process.env.REACT_APP_PUBLIC_URL,
  timeout: 30000
});

controller.interceptors.response.use((response) => {
  return response;
}, (error) => {
  switch (error.response?.status) {
    case 401:
      // fall through
    case 403:
      // fall through
    case 404:
      // fall through
    case 409:
      // fall through
    case 500:
      return error.response.data?.message;
    default:
      break;
  }

  return Promise.reject(error);
});

export default controller;
