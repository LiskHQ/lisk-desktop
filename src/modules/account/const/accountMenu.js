import routes from 'src/routes/routes';

export const accountMenu = ({
  isHW,
  hasNetworkError,
  isLoadingNetwork,
  address,
}) => [
  {
    component: 'accountDetails',
    icon: 'profileOutline',
    label: 'Account details',
    data: { address },
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
    isHidden: isHW || hasNetworkError || isLoadingNetwork,
  },
  {
    path: routes.addAccountOptions.path,
    icon: 'plus',
    label: 'Add new account',
  },
  {
    component: 'removeSelectedAccount',
    icon: 'removeRed',
    label: 'Remove account',
    isHidden: hasNetworkError || isLoadingNetwork,
  },
];
