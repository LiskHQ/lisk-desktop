
/* this file is ignored by coverage because it's just a simple wrapper
  created to allow mocking `process` in unit tests.
*/

/* istanbul ignore file */
export default {
  isPlatform: os => process.platform === os,
  getArgv: () => process.argv,
};
