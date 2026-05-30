import API from "./axios";

export const getMyVerifications = async () => {
  const response = await API.get("/verifications/my-requests");
  return response.data;
};

export const createVerificationRequest = async (data) => {
  const response = await API.post("/verifications", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getAllVerifications = async (params = {}) => {
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
