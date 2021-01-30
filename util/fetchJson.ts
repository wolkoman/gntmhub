export function fetchJson(url: string, postData?: any) {
  return fetch(url, {
    method: postData ? "POST" : "GET",
    body: postData ? JSON.stringify(postData) : undefined,
    headers: postData ? { "Content-Type": "application/json" } : {},
  }).then(async resp =>
    resp.status === 200
      ? await resp.json()
      : await Promise.reject(await resp.json())
  );
}
