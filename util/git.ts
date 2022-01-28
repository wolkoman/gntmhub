function httpGet(theUrl: string, return_headers: true): XMLHttpRequest;
function httpGet(theUrl: string, return_headers: false): string;
function httpGet(theUrl: string): string;
function httpGet(theUrl: string, return_headers?: boolean): any {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    if (return_headers) {
        return xmlHttp
    }
    return xmlHttp.responseText;
}

export function get_all_commits_count(owner: string, repo: string, sha: string) {
    const first_commit = get_first_commit(owner, repo);
    const compare_url = 'https://api.github.com' + '/repos/' + owner + '/' + repo + '/compare/' + first_commit + '...' + sha;
    const commit_req = httpGet(compare_url);
    const commit_count = JSON.parse(commit_req)['total_commits'] + 1;
    console.log('Commit Count: ', commit_count);
    return commit_count
}

function get_first_commit(owner: string, repo: string) {
    let url = 'https://api.github.com' + '/repos/' + owner + '/' + repo + '/commits';
    let req = httpGet(url, true);
    let first_commit_hash = '';
    if (req.getResponseHeader('Link')) {
        const page_url = req.getResponseHeader('Link')?.split(',')[1].split(';')[0].split('<')[1].split('>')[0];
        const req_last_commit = httpGet(page_url ?? '');
        const first_commit = JSON.parse(req_last_commit);
        first_commit_hash = first_commit[first_commit.length - 1]['sha']
    } else {
        const first_commit = JSON.parse(req.responseText);
        first_commit_hash = first_commit[first_commit.length - 1]['sha'];
    }
    return first_commit_hash;
}

const owner = 'wolkoman';
const repo = 'gntmhub';
const sha = 'main';
get_all_commits_count(owner, repo, sha);