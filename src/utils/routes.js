import routes from './../constants/routes';

export default [
  {
    regex: /\/main\/account-visual-demo(?:\/[^/]*)?$/,
    path: `${routes.main.path}${routes.accountVisualDemo.path}/`,
    params: 'dialog',
    name: 'account-visual-demo',
  }, {
    regex: /\/main\/dashboard(?:\/[^/]*)?$/,
    path: `${routes.main.path}${routes.dashboard.path}/`,
    params: 'dialog',
    name: 'dashboard',
  }, {
    regex: /\/main\/transactions(?:\/[^/]*)?$/,
    path: `${routes.main.path}${routes.wallet.path}/`,
    params: 'dialog',
    name: 'transactions',
  }, {
    regex: /\/main\/voting(?:\/[^/]*)?$/,
    path: `${routes.main.path}${routes.voting.path}/`,
    params: 'dialog',
    name: 'voting',
  }, {
    regex: /\/main\/sidechains(?:\/[^/]*)?$/,
    path: `${routes.main.path}${routes.sidechains.path}/`,
    params: 'dialog',
    name: 'sidechains',
  }, {
    regex: /\/add-account(?:\/[^/]*)?$/,
    path: `${routes.addAccount.path}/`,
    params: 'dialog',
    name: 'add-account',
  }, {
    regex: /\/explorer\/accounts\/\d{1,21}[L|l](?:\/[^/]*)?$/,
    path: new RegExp(`${routes.explorer.path}${routes.account.path}/\\d{1,21}[L|l]/`),
    params: 'address',
    name: 'accounts',
  }, {
    regex: /\/explorer\/result\/([0-9]+|[a-z]+)(?:\/[^/]*)?$/,
    path: new RegExp(`${routes.explorer.path}${routes.searchResult.path}/([0-9]+|[a-z]+)/`),
    params: 'query',
    name: 'result',
  }, {
    regex: /\/explorer\/search(?:\/[^/]*)?$/,
    path: `${routes.explorer.path}${routes.search.path}/`,
    name: 'explorer',
  }, {
    regex: /\/explorer\/transactions\/\d+(?:\/[^/]*)?$/,
    path: new RegExp(`${routes.explorer.path}${routes.transaction.path}/\\d+/`),
    params: 'id',
    name: 'explorer-transaction',
  }, {
    regex: /register(?:\/[^/]*)?$/,
    path: `${routes.register.path}/`,
    params: 'dialog',
    name: 'register',
  }, {
    regex: /^\/$/,
    path: '/',
    params: 'dialog',
    name: 'login',
  }, {
    regex: /./,
    path: '/',
    params: 'notFound',
    name: 'not-found',
  },
];
