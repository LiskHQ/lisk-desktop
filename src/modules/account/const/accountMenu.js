import routes from '@screens/router/routes';

// eslint-disable-next-line import/prefer-default-export
export const ACCOUNT_MENU = [
  {
    path: routes.login.editAccountName,
    icon: 'edit',
    label: 'Edit name',
  },
  {
    path: routes.login.switchAccount,
    icon: 'switchIcon',
    label: 'Switch account',
  },
  {
    path: routes.backupAccount.path,
    icon: 'refresh',
    label: 'Backup account',
  },
  {
    path: routes.login.removeAccount,
    icon: 'remove',
    label: 'Remove account',
  },
];
