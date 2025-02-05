const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;

export async function loginUser(userData: any) {
  console.log("API Base URL:", baseAPI);

  const response = await fetch(`${baseAPI}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();
  console.log("Backend result:", result);

  if (result && result.token) {
    // Store the token and user data in localStorage
    localStorage.setItem("authToken", result.token);
    localStorage.setItem("user", JSON.stringify(result));
    return result;
  } else {
    return result;
  }
}
