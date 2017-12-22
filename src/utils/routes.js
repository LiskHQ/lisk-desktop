export default [
  {
    regex: /\/main\/account-visual-demo(?:\/[^/]*)?$/,
    path: '/main/account-visual-demo/',
    params: 'dialog',
    name: 'account-visual-demo',
  }, {
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
    regex: /\/main\/add-account(?:\/[^/]*)?$/,
    path: '/main/add-account/',
    params: 'dialog',
    name: 'add-account',
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
