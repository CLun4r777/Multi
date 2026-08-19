function getFeedBuildValues() {
  return [0, 0, 0, 0, 0, 0, 0, 9];
}

function getBuildForTarget(target, tanks) {
  if (target && target.feed) {
    return getFeedBuildValues();
  }

  const tankName = target && target.tank ? target.tank : 'basic';
  const tank = tanks && tanks[tankName] ? tanks[tankName] : null;
  const build = tank && tank.build ? tank.build : '';

  if (!build) {
    return [];
  }

  if (Array.isArray(build)) {
    return build;
  }

  return String(build)
    .split('/')
    .filter((part) => part !== '')
    .map((part) => Number.parseInt(part, 10));
}

module.exports = {
  getBuildForTarget,
  getFeedBuildValues
};
