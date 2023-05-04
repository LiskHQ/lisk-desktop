import routes from 'src/routes/routes';

export const accountMenu = (authData, isHW) => [
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
    isHidden: isHW,
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
    isHidden: authData?.data?.numberOfSignatures > 0,
  },
  {
    component: 'removeSelectedAccount',
    icon: 'removeRed',
    label: 'Remove account',
  },
];
