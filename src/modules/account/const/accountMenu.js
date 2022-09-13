import routes, { modals } from 'src/routes/routes';

// eslint-disable-next-line import/prefer-default-export
export const ACCOUNT_MENU = [
  {
    path: routes.login.editAccountName,
    icon: 'edit',
    label: 'Edit name',
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
    path: routes.addAccount.path,
    icon: 'plus',
    label: 'Add new account',
  },
  {
    path: modals.multiSignature.path,
    icon: 'multiSignatureOutline',
    label: 'Upgrade to multisignature',
  },
  {
    component: 'removeCurrentAccountFlow',
    icon: 'remove',
    label: 'Remove account',
  },
];
