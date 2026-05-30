import API from "./axios";

export const getMyProfile = async () => {
  const response = await API.get("/profile/me");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put("/profile/me", profileData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getPublicProfile = async (username) => {
  const response = await API.get(`/profile/public/${username}`);
  return response.data;
};
