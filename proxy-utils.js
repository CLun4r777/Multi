function normalizeProxyUrl(proxy, type = 'http') {
  if (!proxy || typeof proxy !== 'string') return null;

  const trimmed = proxy.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed) || /^socks5?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/^([^:]+):(\d+)(?::([^:]+):(.+))?$/);
  if (!match) return null;

  const [, host, port, username, password] = match;
  if (!host || !port || Number.isNaN(Number(port))) return null;

  if (username && password !== undefined) {
    const protocol = type === 'socks' ? 'socks5://' : 'http://';
    return `${protocol}${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}`;
  }

  const protocol = type === 'socks' ? 'socks5://' : 'http://';
  return `${protocol}${host}:${port}`;
}

function createFallbackStatusResponse() {
  const payload = { ok: false, status: {} };
  return {
    ok: false,
    status: 200,
    headers: new Map([['content-type', 'application/json']]),
    json: async () => payload,
    text: async () => JSON.stringify(payload),
    arrayBuffer: async () => Buffer.from(JSON.stringify(payload)),
    clone: function () { return this; }
  };
}

module.exports = {
  normalizeProxyUrl,
  createFallbackStatusResponse,
};
