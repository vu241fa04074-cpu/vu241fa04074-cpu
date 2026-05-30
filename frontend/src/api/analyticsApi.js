import API from "./axios";

export const getMyAnalytics = async () => {
  const response = await API.get("/analytics/me");
  return response.data;
};
