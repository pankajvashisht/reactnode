import axios from 'axios';
const apis = "http://127.0.0.1:4000/admins";
export const Adminlogin = ({email, password}) => {
    return axios.post(`${apis}/login`, {
        email:email,
        password:password
      })
}