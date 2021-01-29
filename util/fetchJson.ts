export default (url: string, data?: any) =>
  fetch(url, {
    method: data ? "POST" : "GET",
    body: data ? JSON.stringify(data) : undefined,
    headers: data ? { "Content-Type": "application/json" } : {},
  }).then(resp => (resp.status === 200 ? resp.json() : Promise.reject()));
