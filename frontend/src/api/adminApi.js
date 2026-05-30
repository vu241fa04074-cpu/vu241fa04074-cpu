import API from "./axios";

export const getAdminStats = async () => {
  const response = await API.get("/admin/stats");
  return response.data;
};

export const getAllVerificationsAdmin = async (params = {}) => {
  const response = await API.get("/verifications/admin", { params });
  return response.data;
};

export const approveVerification = async (id, remarks) => {
  const response = await API.put(`/verifications/${id}/approve`, { remarks });
  return response.data;
};

export const rejectVerification = async (id, remarks) => {
  const response = await API.put(`/verifications/${id}/reject`, { remarks });
  return response.data;
};
