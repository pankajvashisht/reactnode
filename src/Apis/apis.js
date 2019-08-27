import axios from 'axios';
const apis = "http://localhost:4000/admins";
const header = {
  headers: {
    token : "",
  }
};
let login_datails = ''

if (typeof localStorage.getItem('userInfo') === 'string') {
    login_datails = JSON.parse(localStorage.getItem('userInfo'));
}
if (typeof login_datails === 'object') {
   login_datails = JSON.parse(localStorage.getItem('userInfo'));
   header.headers.token = login_datails.token;
   console.log(header);
}
console.log(header);
export const Adminlogin = ({email, password}) => {
    return axios.post(`${apis}/login`, {
        email,
        password
      })
}

export const addUser = userForm => {
  let form = new FormData();
  form.append('name', userForm.name);
  form.append('password', userForm.password);
  form.append('email', userForm.email);
  form.append('profile', userForm.profile);
  return axios.post(`${apis}/users?token=${login_datails.token}`, {
      form,
    })
}
export const getUser = (page=1) => {
  return axios.get(`${apis}/users?token=${login_datails.token}`, {
    })
}

export const updateUser = (data) => {
  return axios.put(`${apis}/users?token=${login_datails.token}`, {
    ...data,
    })
}

export const deleteUser = (data) => {
  return axios.delete(`${apis}/users?token=${login_datails.token}`, {
    ...data,
    })
}