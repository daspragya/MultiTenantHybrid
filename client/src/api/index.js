import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const insertItem = (payload) => api.post(`/item`, payload);
export const updateItemById = (id, payload) => api.put(`/item/${id}`, payload);
export const deleteItemById = (id) => api.delete(`/item/${id}`);
export const getItemById = (id) => api.get(`/item/${id}`);
export const getAllItems = () => api.get(`/items`);

export const signUp = (payload) => api.post(`/auth/signup`, payload);
export const signIn = (payload) =>
  api.post(`/auth/signin`, payload).then((res) => {
    if (res.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(res.data));
    }
    return res;
  });
export const logout = () => {
  localStorage.removeItem("user");
};
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};

export const supplierSignIn = (payload) =>
  api.post(`/supplier/signin`, payload).then((res) => {
    if (res.data.accessToken) {
      localStorage.setItem("supplier", JSON.stringify(res.data));
    }
    return res;
  });
export const supplierNames = () => api.get(`/suppliers`);
export const changeSupplier = () => {
  localStorage.removeItem("supplier");
};
export const getCurrentSupplier = () => {
  const userStr = localStorage.getItem("supplier");
  if (userStr) return JSON.parse(userStr);
  return null;
};

export const authHeader = () => {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr) user = JSON.parse(userStr);

  if (user && user.accessToken) {
    const supplierStr = localStorage.getItem("supplier");
    let supplier = null;
    if (supplierStr) supplier = JSON.parse(supplierStr);

    if (supplier && supplier.accessToken) {
      return {
        "x-access-token": user.accessToken,
        "x-access-token-supplier": supplier.accessToken,
      };
    } else {
      return {
        "x-access-token": user.accessToken,
        "x-access-token-supplier": null,
      };
    }
  } else {
    return {
      "x-access-token": null,
      "x-access-token-supplier": null,
    };
  }
};

api.interceptors.request.use(
  (config) => {
    const headers = apis.authHeader();
    config.headers = headers;
    return config;
  },
  (error) => {
    console.log(error);
  }
);

const apis = {
  insertItem,
  getAllItems,
  updateItemById,
  deleteItemById,
  getItemById,
  signIn,
  signUp,
  logout,
  getCurrentUser,
  authHeader,
  supplierSignIn,
  changeSupplier,
  getCurrentSupplier,
  supplierNames,
};

export default apis;
