import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: 'https://shoppinglist-restful-api.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
});
export default axiosConfig;
