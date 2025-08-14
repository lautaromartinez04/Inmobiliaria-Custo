// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL;

async function http(method, url, data) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (data) opts.body = JSON.stringify(data);

  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${method} ${url} -> ${res.status} ${text}`);
  }
  return res.json();
}

export const propiedadesApi = {
  list: () => http("GET", `${API_URL}`),
  get: (id) => http("GET", `${API_URL}/${id}`),
  create: (payload) => http("POST", `${API_URL}`, payload),
  update: (id, payload) => http("PUT", `${API_URL}/${id}`, payload),
  remove: (id) => http("DELETE", `${API_URL}/${id}`),
};
