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
  const response = await fetch(`${baseAPI}/cases/attempt1/${id}`, {
    method: "PUT", // Use "PUT" or "PATCH" for updating
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  console.log("Backend result:", result);

  return result;
}

// attempt2
export async function attempt2(id: any) {
  const response = await fetch(`${baseAPI}/cases/attempt2/${id}`, {
    method: "PUT", // Use "PUT" or "PATCH" for updating
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  console.log("Backend result:", result);

  return result;
}

// attempt2
export async function attempt3(id: any) {
  const response = await fetch(`${baseAPI}/cases/attempt3/${id}`, {
    method: "PUT", // Use "PUT" or "PATCH" for updating
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  console.log("Backend result:", result);

  return result;
}

// get specific case
export async function getSpecificCase(id: any) {
  const response = await fetch(`${baseAPI}/cases/getSpecificCaseOnly/${id}`, {
    method: "GET", // Use "PUT" or "PATCH" for updating
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  return result;
}

export async function uploadDoucmentaryImages(id: any, data: any) {
  console.log("data", data);
  const response = await fetch(
    `${baseAPI}/cases/uploadDocumentaryImages/${id}`,
    {
      method: "PUT", // Use "PUT" or "PATCH" for updating
      body: data, // Send the updated data
    }
  );

  const result = await response.json();
  console.log("Backend result:", result);

  return result;
}

export async function uploadCaseForms(id: any, data: any) {
  const response = await fetch(`${baseAPI}/cases/caseForms/${id}`, {
    method: "PUT", // Use "PUT" or "PATCH" for updating
    body: data, // Send the updated data
  });

  const result = await response.json();
  console.log("Backend result:", result);

  return result;
}
