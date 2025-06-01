export function login(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}