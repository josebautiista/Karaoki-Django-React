import { api } from "../config/axiosConfig";

export const check = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await api.get("/verify-token/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.status === 200;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};
