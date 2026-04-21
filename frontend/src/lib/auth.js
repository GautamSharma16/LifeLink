export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("lifelink_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getCurrentRole = () => getCurrentUser()?.role || "user";

export const isLoggedIn = () => {
  try {
    const token = localStorage.getItem("lifelink_token");
    return !!token;
  } catch {
    return false;
  }
};

