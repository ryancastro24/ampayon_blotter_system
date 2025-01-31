const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;

export async function getUsers() {
  console.log(baseAPI);
  const usersData = await fetch(`${baseAPI}/users`);
  const result = await usersData.json();

  console.log("backend result:", result);
  return result;
}

export type UserDataType = {
  _id: string;
  region_code: number;
  city_code: number;
  barangay_code: number;
  barangay_captain: string;
  barangay_secretary: string;
  username: string;
  password: string;
  barangay_name: string;
  city_name: string;
  region_name: string;
};

export async function addUser(userData: any) {
  console.log("API Base URL:", baseAPI);

  const response = await fetch(`${baseAPI}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();
  console.log("Backend result:", result);

  return result;
}
