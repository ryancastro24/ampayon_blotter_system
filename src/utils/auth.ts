// utils/auth.ts
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("authToken");

  console.log(token);

  if (token === undefined) {
    return token === null;
  } else {
    return token !== null;
  }
};
