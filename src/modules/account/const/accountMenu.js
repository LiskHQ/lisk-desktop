import routes from 'src/routes/routes';

export const ACCOUNT_MENU = [
  {
    component: 'editAccount',
    icon: 'edit',
    label: 'Edit account name',
  },
  {
    component: 'switchAccount',
    icon: 'switchIcon',
    label: 'Switch account',
  },
  {
    path: routes.backupRecoveryPhraseFlow.path,
    icon: 'refresh',
    label: 'Backup account',
  },
  {
    path: routes.addAccountOptions.path,
    icon: 'plus',
    label: 'Add new account',
  },
  {
    component: 'multiSignature',
    icon: 'multiSignatureOutline',
    label: 'Register multisignature account',
  },
  {
    component: 'removeSelectedAccount',
    icon: 'removeRed',
    label: 'Remove account',
  },
];
