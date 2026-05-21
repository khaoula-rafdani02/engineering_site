const BASE_URL = "http://127.0.0.1:8000/api";

export const apiFetch = (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token;

  return fetch(`${BASE_URL}/${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }
  });
};