export function post(route: string, body: any) {
    return fetch(route, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    }).then(response => new Promise(async (res, rej) =>
        response.status >= 400
            ? rej(await response.json())
            : res(await response.json())));
}