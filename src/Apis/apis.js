import axios from "axios";
const apis = "http://localhost:4000/admins";
const header = {
  headers: {
    token: ""
  }
};
let login_datails = "";
const details = () => {
  if (typeof localStorage.getItem("userInfo") === "string") {
    login_datails = JSON.parse(localStorage.getItem("userInfo"));
  }
  if (typeof login_datails === "object") {
    login_datails = JSON.parse(localStorage.getItem("userInfo"));
    header.headers.token = login_datails.token;
  }
};
export const Adminlogin = ({ email, password }) => {
  return axios.post(`${apis}/login`, {
    email,
    password
  });
};

export const addUser = userForm => {
  let form = new FormData();
  form.append("name", userForm.name);
  form.append("password", userForm.password);
  form.append("email", userForm.email);
  form.append("profile", userForm.profile);
  return axios.post(`${apis}/users?token=${login_datails.token}`, form, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
export const getUser = (page = 1, query = "") => {
  return axios.get(`${apis}/users?token=${login_datails.token}&q=${query}`);
};
export const getPost = (page = 1, query = "") => {
  return axios.get(`${apis}/posts?token=${login_datails.token}&q=${query}`);
};
export const dashBaord = () => {
  details();
  return axios.get(`${apis}/dashboard?token=${login_datails.token}`);
};

export const updateUser = data => {
  return axios.put(`${apis}/users?token=${login_datails.token}`, {
    table: data.table,
    id: data.id,
    status: data.status
  });
};

export const deleteUser = data => {
  return axios.delete(
    `${apis}/users?token=${login_datails.token}`,
    { data },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
};

export const checkAuth = () => {
  return axios.get(`${apis}/checkAuth?token=${login_datails.token}`);
};

export const transaction = (page = 1, query = "") => {
  return axios.get(
    `${apis}/transaction?token=${login_datails.token}&q=${query}`
  );
};

export const addPost = data => {
  var form = new FormData();
  form.append("title", data.name);
  form.append("url", data.url);
  form.append("post_type", data.posttype);
  form.append("price", data.price);
  form.append("description", data.description);
  return axios.post(`${apis}/posts?token=${login_datails.token}`, form, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
