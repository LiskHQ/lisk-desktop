import routes from './../constants/routes';

export default [
  {
    regex: /\/main\/account-visual-demo(?:\/[^/]*)?$/,
    path: `${routes.main}${routes.accountVisualDemo.url}/`,
    params: 'dialog',
    name: 'account-visual-demo',
  }, {
    regex: /\/main\/dashboard(?:\/[^/]*)?$/,
    path: `/main${routes.dashboard.url}/`,
    params: 'dialog',
    name: 'dashboard',
  }, {
    regex: /\/main\/transactions(?:\/[^/]*)?$/,
    path: `${routes.main}${routes.wallet.url}/`,
    params: 'dialog',
    name: 'transactions',
  }, {
    regex: /\/main\/voting(?:\/[^/]*)?$/,
    path: `/main${routes.voting.url}/`,
    params: 'dialog',
    name: 'voting',
  }, {
    regex: /\/main\/sidechains(?:\/[^/]*)?$/,
    path: `/main${routes.sidechains.url}/`,
    params: 'dialog',
    name: 'sidechains',
  }, {
    regex: /\/add-account(?:\/[^/]*)?$/,
    path: `${routes.addAccount.url}/`,
    params: 'dialog',
    name: 'add-account',
  }, {
    regex: /\/explorer\/accounts\/\d{1,21}[L|l](?:\/[^/]*)?$/,
    path: new RegExp(`/explorer${routes.account.url}/\\d{1,21}[L|l]/`),
    params: 'address',
    name: 'accounts',
  }, {
    regex: /\/explorer\/result\/([0-9]+|[a-z]+)(?:\/[^/]*)?$/,
    path: new RegExp(`/explorer${routes.searchResult.url}/([0-9]+|[a-z]+)/`),
    params: 'query',
    name: 'result',
  }, {
    regex: /\/explorer\/search(?:\/[^/]*)?$/,
    path: `/explorer${routes.search.url}/`,
    name: 'explorer',
  }, {
    regex: /\/explorer\/transactions\/\d+(?:\/[^/]*)?$/,
    path: new RegExp(`/explorer${routes.transaction.url}/\\d+/`),
    params: 'id',
    name: 'explorer-transaction',
  }, {
    regex: /register(?:\/[^/]*)?$/,
    path: `${routes.register.url}/`,
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
