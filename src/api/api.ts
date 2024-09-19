import { UserData } from "../utils/types";

const BASE_URL = "https://assignment.stage.crafto.app";

export async function createUser(userData: UserData) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userData.userName,
      otp: userData.otp,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const data = await response.json();
  return data;
}

export async function getQuotes(token: string, limit = 20, offset = 0) {
  const response = await fetch(
    `${BASE_URL}/getQuotes?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch quotes");
  }

  const data = await response.json();
  return data;
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "https://crafto.app/crafto/v1.0/media/assignment/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();

  return data;
}

export async function createQuote(
  token: string,
  text: string,
  mediaUrl: string
) {
  const response = await fetch(`${BASE_URL}/postQuote`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      mediaUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create quote");
  }

  const data = await response.json();
  return data;
}
