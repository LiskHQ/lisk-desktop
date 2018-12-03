
export default {
  isPlatform: os => process.platform === os,
  getArgv: () => process.argv,
};
