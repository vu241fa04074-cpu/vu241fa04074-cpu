import API from "./axios";

export const getAchievements = async () => {
  const response = await API.get("/achievements");
  return response.data;
};

export const createAchievement = async (data) => {
  const response = await API.post("/achievements", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateAchievement = async (id, data) => {
  const response = await API.put(`/achievements/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteAchievement = async (id) => {
  const response = await API.delete(`/achievements/${id}`);
  return response.data;
};
