import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Icon from 'src/theme/Icon';
import { useCurrentAccount } from '@account/hooks';
import DialogLink from '@theme/dialog/link';
import { Link } from 'react-router-dom';
import { ApplicationBootstrapContext } from '@setup/react/app/ApplicationBootstrap';
import { accountMenu } from '@account/const';
import { useAuth } from '@auth/hooks/queries';
import { useTokenBalances } from 'src/modules/token/fungible/hooks/queries';
import { useValidateFeeBalance } from 'src/modules/token/fungible/hooks/queries/useValidateFeeBalance';
import { INSUFFICENT_TOKEN_BALANCE_MESSAGE } from 'src/modules/common/constants';

// eslint-disable-next-line max-statements
const AccountMenuListing = ({ className, onItemClicked }) => {
  const { t } = useTranslation();
  const [currentAccount] = useCurrentAccount();
  const { hasNetworkError, isLoadingNetwork } = useContext(ApplicationBootstrapContext);
  const tokenBalances = useTokenBalances({
    options: { enabled: !isLoadingNetwork && !hasNetworkError },
  });
  const { address, isHW } = currentAccount?.metadata || {};

  const { data: authData } = useAuth({
    config: { params: { address } },
  });

  const { hasSufficientBalanceForFee, feeToken } = useValidateFeeBalance();
  const hasAvailableTokenBalance = tokenBalances.data?.data?.some(
    ({ availableBalance }) => BigInt(availableBalance) > 0
  );

  function getDialogProps(component, data) {
    if (component === 'removeSelectedAccount' && currentAccount?.metadata?.address) {
      return {
        component,
        data: { address: currentAccount?.metadata?.address, ...data },
      };
    }
    return { component, data };
  }

  const getInSufficientBalanceMessage = () => {
    if (!hasAvailableTokenBalance) {
      return {
        message: INSUFFICENT_TOKEN_BALANCE_MESSAGE.registerMultiSignature,
      };
    }

    if (!hasSufficientBalanceForFee) {
      return {
        message: INSUFFICENT_TOKEN_BALANCE_MESSAGE.fees(feeToken?.symbol),
      };
    }

    return {};
  };

  return (
    <ul className={className}>
      {accountMenu({
        authData,
        isHW,
        address,
        hasNetworkError,
        isLoadingNetwork,
        insuffientBalanceMessage: getInSufficientBalanceMessage(),
      }).map(
        ({ path, icon, label, component, isHidden, data }) =>
          !isHidden && (
            <li key={label} onClick={onItemClicked}>
              {component ? (
                <DialogLink {...getDialogProps(component, data)}>
                  <Icon name={icon} />
                  {t(label)}
                </DialogLink>
              ) : (
                <Link to={path}>
                  <Icon name={icon} />
                  {t(label)}
                </Link>
              )}
            </li>
          )
      )}
    </ul>
  );
};

export default AccountMenuListing;
