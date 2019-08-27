import axios from 'axios';
const apis = "http://127.0.0.1:4000/admins";

const headers = {
  token : localStorage.getItem("userInfo").token
};



export const Adminlogin = ({email, password}) => {
    return axios.post(`${apis}/login`, {
      email,
      password
      })
}

export const addUser = ({name,email,password,profile}) => {
  return axios.post(`${apis}/users`, {
       name,
       email,
       password,
       profile
    },headers)
}
export const getUser = () => {
  return axios.get(`${apis}/users`, headers)
}