
import api from "./api";

export const uploadPropertyImage = async (
  propertyId: number,
  image: File
) => {
  const formData = new FormData();

  formData.append("image", image);

  const response = await api.post(
    `/properties/${propertyId}/images`,
    formData
  );

  return response.data;
};

export const deletePropertyImage = async (
  propertyId: number,
  imageId: number
) => {
  const response = await api.delete(
    `/properties/${propertyId}/images/${imageId}`
  );

  return response.data;
};
