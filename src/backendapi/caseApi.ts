const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;
// update user
export async function addCase(caseData: any) {
  console.log("API Base URL:", baseAPI);

  const response = await fetch(`${baseAPI}/cases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(caseData),
  });

  const result = await response.json();
  console.log("Backend result:", result);

  return result;
}

// get cases
export async function getCases(id: string | undefined) {
  const casesData = await fetch(`${baseAPI}/cases/${id}`);
  const result = await casesData.json();

  console.log("backend result:", result);
  return result;
}

// delete case
export async function deleteCase(userId: string) {
  const response = await fetch(`${baseAPI}/cases/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  console.log("Backend result:", result);

  return result;
}

// update case

// Update case
export async function updateCase(id: any, updatedData: any) {
  const response = await fetch(`${baseAPI}/cases/${id}`, {
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

// attempt1
export async function attempt1(id: any) {
  const date = new Date();

  console.log(id);

  const updateData = {
    attempt1: true,
    attempt1Date: date.toISOString(),
  };
  const response = await fetch(`${baseAPI}/cases/${id}`, {
    method: "PUT", // Use "PUT" or "PATCH" for updating
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData), // Send the updated data
  });

  const result = await response.json();
  console.log("Backend result:", result);

  return result;
}
