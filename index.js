const CUSTOM_DOMAINS = {
    'npm.example.com': 'https://registry.npmjs.org',
    'yarn.example.com': 'https://registry.yarnpkg.com',
    // 你可以添加更多的镜像地址
};

const DEFAULT_UPSTREAM = CUSTOM_DOMAINS['npm.example.com'];

const json = (data = {}, code = 200, headers = {}) => {
    return new Response(JSON.stringify(data), {
        status: code,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-Powered-By': 'X-Powered-By cloudflare npm proxy',
            ...headers,
        },
    });
};

// 路由函数，根据请求的主机名选择相应的上游地址
function routeByHosts(host) {
    return CUSTOM_DOMAINS[host] || DEFAULT_UPSTREAM;
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const upstream = routeByHosts(url.hostname);

        if (request.method !== 'GET') {
            return Response.redirect(`${upstream}${url.pathname}`, 302);
        }

        if (url.pathname === '/') {
            return new Response(`Hello ${url.hostname}`);
        }

        const fetchUrl = `${upstream}${url.pathname}`;
        const response = await fetch(fetchUrl);

        if (url.pathname.endsWith('.tgz')) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                const errorData = await response.json();
                return json({ error: `Fetch failed: ${errorData.message}` }, 500);
            } else {
                return response;
            }
        }

        const data = await response.json();

        if (data.error) {
            return json(data, 500);
        }

        if (data && data.dist && data.dist.tarball) {
            data.dist.tarball = data.dist.tarball.replace(upstream, url.hostname);
        }

        return json(data);
    },
};
