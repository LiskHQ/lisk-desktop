const semver = require('semver');
const { engines } = require('../package');

const version = engines.node;
const currentVersion = process.version;

if (!semver.satisfies(currentVersion, version)) {
  console.error(`\n\tCurrent node version ${currentVersion} \n\tRequired node version ${version}...\n`); // eslint-disable-line no-console
  throw new Error('Invalid current node version');
} else {
  console.info('\n\tThe current node version satisfy the required version...\n\n'); // eslint-disable-line no-console
}
