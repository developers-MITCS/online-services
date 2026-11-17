import { ENV } from "../config/env";

export const createApiClient = (
  getToken: () => string | null,
  logout?: () => void,
) => {
  return async (url: string, options: any = {}) => {
    const token = getToken();

    const response = await fetch(`${ENV.API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    // =========================
    // HANDLE UNAUTHORIZED
    // =========================
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (logout) logout();

      window.location.href = "/login";
      return null;
    }

    return response;
  };
};
