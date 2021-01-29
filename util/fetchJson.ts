export function fetchJson(url: string, data?: any) {

return fetch(url, {
    method: data ? "POST" : "GET",
    body: data ? JSON.stringify(data) : undefined,
    headers: data ? { "Content-Type": "application/json" } : {},
  }).then(resp => (resp.status === 200 ? resp.json() : Promise.reject()));
}
