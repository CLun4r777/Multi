function normalizeMainTickMs(mainTickMs) {
  return Number.isFinite(mainTickMs) ? Math.round(mainTickMs) : 140;
}

function getSpawnDelayMs(spawnDelay) {
  return Number.isFinite(spawnDelay) ? Math.round(spawnDelay) : 0;
}

function getArrasWasmUrl(sourceUrl) {
  const defaultUrl = 'https://raw.githubusercontent.com/P-R-2000/arras-fix/refs/heads/main/app.wasm';
  return sourceUrl || defaultUrl;
}

function getSwarmBatchId(batchId) {
  const original = String(batchId ?? 'swarm1').trim().toLowerCase();
  if (!original) return 'swarm1';
  if (original === 'swarm1' || original === 'swarm2') return original;
  if (original === '1' || original === 'one') return 'swarm1';
  if (original === '2' || original === 'two') return 'swarm2';
  const normalized = original.replace(/[^a-z0-9_-]/g, '');
  return normalized.startsWith('swarm') ? normalized : `swarm${normalized || '1'}`;
}

function coerceBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off', ''].includes(normalized)) return false;
  }
  return !!fallback;
}

function parseSpawnPacket(args = []) {
  const hash = String(args[0] ?? '').replace(/^#/, '');
  const count = parseInt(args[1], 10) || 1;
  const customName = String(args[2] ?? '');
  const spawnDelay = parseInt(args[3], 10) || 0;
  const mainTickMs = normalizeMainTickMs(parseInt(args[4], 10) || 140);
  const autoRespawn = coerceBoolean(args[5], true);
  const batchId = getSwarmBatchId(args[6] ?? 'swarm1');
  const tank = args[7] || undefined;
  const autofire = coerceBoolean(args[8], false);
  const autospin = coerceBoolean(args[9], false);

  return {
    hash,
    count,
    customName,
    spawnDelay: getSpawnDelayMs(spawnDelay),
    mainTickMs,
    autoRespawn,
    batchId,
    tank,
    autofire,
    autospin
  };
}

function buildCirclePositions(midpointX = 0, midpointY = 0, radius = 0, count = 0) {
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.round(count)) : 0;
  const safeRadius = Number.isFinite(radius) ? radius : 0;
  const safeMidpointX = Number.isFinite(midpointX) ? midpointX : 0;
  const safeMidpointY = Number.isFinite(midpointY) ? midpointY : 0;

  if (!safeCount || safeRadius <= 0) {
    return Array.from({ length: safeCount }, () => ({ x: safeMidpointX, y: safeMidpointY }));
  }

  return Array.from({ length: safeCount }, (_, index) => {
    const angle = (index / safeCount) * Math.PI * 2;
    return {
      x: safeMidpointX + Math.cos(angle) * safeRadius,
      y: safeMidpointY + Math.sin(angle) * safeRadius
    };
  });
}

module.exports = {
  normalizeMainTickMs,
  getSpawnDelayMs,
  getArrasWasmUrl,
  getSwarmBatchId,
  parseSpawnPacket,
  buildCirclePositions
};
