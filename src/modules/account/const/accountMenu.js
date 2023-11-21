import routes from 'src/routes/routes';

export const accountMenu = ({
  authData,
  isHW,
  hasNetworkError,
  isLoadingNetwork,
  insuffientBalanceMessage,
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
    component: !Object.values(insuffientBalanceMessage).length
      ? 'multiSignature'
      : 'noTokenBalance',
    data: insuffientBalanceMessage,
    icon: 'multiSignatureOutline',
    isHidden: hasNetworkError || isLoadingNetwork,
    label: `${authData?.data?.numberOfSignatures > 0 ? 'Edit' : 'Register'} multisignature account`,
  },
  {
    component: 'removeSelectedAccount',
    icon: 'removeRed',
    label: 'Remove account',
    isHidden: hasNetworkError || isLoadingNetwork,
  },
];
