import i18next from 'i18next';
import routes from 'src/routes/routes';

export const accountMenu = ({
  authData,
  isHW,
  hasNetworkError,
  isLoadingNetwork,
  hasAvailableTokenBalance,
}) => [
  {
    component: 'accountDetails',
    icon: 'profileOutline',
    label: 'Account details',
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
    component: hasAvailableTokenBalance ? 'multiSignature' : 'noTokenBalance',
    data: !hasAvailableTokenBalance
      ? {
          message: i18next.t('Token balance is not enough to register a multisignature account.'),
        }
      : {},
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
