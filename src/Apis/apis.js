import axios from 'axios';
const apis = "http://localhost:4000/admins";
const header = {
  headers: {
    token : "",
  }
};
const login_datails = JSON.parse(localStorage.getItem('userInfo'));  
if(login_datails != undefined && login_datails != null && login_datails.length > 0){
    header.headers.token = login_datails.token;
  }
export const Adminlogin = ({email, password}) => {
    return axios.post(`${apis}/login`, {
        email,
        password
      })
}

export const addUser = from => {
  console.log(from);
  return axios.post(`${apis}/users`, {
      data:from,
      header
    })
}
export const getUser = (page=1) => {
  return axios.get(`${apis}/users`, {
      header
    })
}

export const updateUser = (data) => {
  return axios.put(`${apis}/users`, {
    ...data,  
    header
    })
}

export const deleteUser = (data) => {
  return axios.delete(`${apis}/users`, {
    ...data,  
    header
    })
}