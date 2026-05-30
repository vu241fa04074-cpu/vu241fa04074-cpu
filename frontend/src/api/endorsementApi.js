import API from "./axios";

export const createEndorsement = async (data) => {
  const response = await API.post("/endorsements", data);
  return response.data;
};

export const getUserEndorsements = async (userId) => {
  const response = await API.get(`/endorsements/${userId}`);
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await API.get(`/users?search=${query}`);
  return response.data;
};
