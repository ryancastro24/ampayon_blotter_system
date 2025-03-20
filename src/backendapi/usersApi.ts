const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;

export async function getUsers() {
  console.log(baseAPI);
  const usersData = await fetch(`${baseAPI}/users`);
  const result = await usersData.json();

  console.log("backend result:", result);
  return result;
}

export async function getUserProfile(id: string | undefined) {
  console.log(baseAPI);
  const usersData = await fetch(`${baseAPI}/users/${id}`);
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
  ongoingCase: number;
  failedCase: number;
  settledCase: number;
  totalCases: number;
};

// update user
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

// delete user
export async function deleteUser(userId: string) {
  const response = await fetch(`${baseAPI}/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  console.log("Backend result:", result);

  return result;
}

// update user

// Update case
export async function updateUser(id: any, updatedData: any) {
  const response = await fetch(`${baseAPI}/users/${id}`, {
    method: "PUT", // Use "PUT" or "PATCH" for updating
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData), // Send the updated data
  });

  const result = await response.json();
  console.log("Backend result:", result);

  return result;
}

// update user
export async function getUserDetails(id: string) {
  const response = await fetch(`${baseAPI}/users/${id}`);
  const result = await response.json();
  console.log("Backend result:", result);
  return result;
}
