export default [
  {
    regex: /\/main\/transactions(?:\/[^/]*)?$/,
    path: '/main/transactions/',
    params: 'dialog',
    name: 'transactions',
  }, {
    regex: /\/main\/voting(?:\/[^/]*)?$/,
    path: '/main/voting/',
    params: 'dialog',
    name: 'voting',
  }, {
    regex: /\/main\/forging(?:\/[^/]*)?$/,
    path: '/main/forging/',
    params: 'dialog',
    name: 'forging',
  }, {
    regex: /register(\/)?$/,
    path: '/',
    params: 'dialog',
    name: 'login',
  }, {
    regex: /^\/$/,
    path: '/',
    params: 'dialog',
    name: 'login',
  },
];
