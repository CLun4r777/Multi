function normalizeTankName(tank) {
  if (typeof tank !== 'string') return '';
  return tank.trim().toLowerCase();
}

function resolveTankName(tank, tanks, fallback = 'basic') {
  const normalized = normalizeTankName(tank);
  if (!normalized) return fallback;

  if (tanks[normalized]) return normalized;

  const directMatch = Object.keys(tanks).find((candidate) => normalizeTankName(candidate) === normalized);
  if (directMatch) return directMatch;

  return fallback;
}

module.exports = {
  normalizeTankName,
  resolveTankName
};
