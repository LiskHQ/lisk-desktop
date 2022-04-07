import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import routes from '@screens/router/routes';
import { selectSearchParamValue } from '@screens/router/searchParams';
import styles from './discreetMode.css';

const DiscreetMode = ({
  children, location, isDiscreetMode, shouldEvaluateForOtherAccounts,
  addresses, account, token,
}) => {
  const isBlurHandledOnOtherWalletPage = useMemo(() => {
    const { search } = location || {};
    const address = selectSearchParamValue(search, routes.account.searchParam);
    return account.info && address === account.info[token].address;
  });

  const shouldEnableDiscreetMode = () => {
    if (!isDiscreetMode) return false;
    if (shouldEvaluateForOtherAccounts) {
      if (location.pathname.includes(routes.account.path)) {
        return isBlurHandledOnOtherWalletPage();
      }
      const { search } = location || {};
      if (selectSearchParamValue(search, 'modal') === 'transactionDetails') {
        return addresses.length
          ? addresses.includes(account.summary?.address)
          : isBlurHandledOnOtherWalletPage();
      }
    }
    return true;
  };

  const discreetModeClass = shouldEnableDiscreetMode() ? styles.discreetMode : '';
  return (
    <div className={discreetModeClass}>
      {discreetModeClass.length ? <span className={styles.preformat} /> : ''}
      {children}
    </div>
  );
};

DiscreetMode.defaultProps = {
  addresses: [],
  shouldEvaluateForOtherAccounts: false,
};

DiscreetMode.propTypes = {
  account: PropTypes.object.isRequired,
  addresses: PropTypes.array,
  isDiscreetMode: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  shouldEvaluateForOtherAccounts: PropTypes.bool,
};

export default DiscreetMode;
