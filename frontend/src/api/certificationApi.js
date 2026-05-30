import API from "./axios";

export const getCertifications = async () => {
  const response = await API.get("/certifications");
  return response.data;
};

export const createCertification = async (data) => {
  const response = await API.post("/certifications", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateCertification = async (id, data) => {
  const response = await API.put(`/certifications/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteCertification = async (id) => {
  const response = await API.delete(`/certifications/${id}`);
  return response.data;
};
