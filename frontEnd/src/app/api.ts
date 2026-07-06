export const API_BASE_URL = "http://localhost:8080/api";

export async function authFetch(endpoint: string, options: any = {}) {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const contentType = res.headers.get("content-type");

  let data: any = null;

  if (contentType?.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const errorMessage =
      typeof data === "string"
        ? data
        : data?.message || data?.error || "Erreur serveur";
    throw new Error(errorMessage);
  }

  return data;
}