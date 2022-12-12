import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import routes from 'src/routes/routes';
import { selectSearchParamValue } from 'src/utils/searchParams';
import classNames from 'classnames';
import styles from './discreetMode.css';

const DiscreetMode = ({
  className,
  children,
  location,
  isDiscreetMode,
  shouldEvaluateForOtherAccounts,
  addresses,
  account,
  token,
}) => {
  const isBlurHandledOnOtherWalletPage = useMemo(() => {
    const { search } = location;
    const address = selectSearchParamValue(search, routes.explorer.searchParam);
    return account.info && address === account.info[token].address;
  }, [location, account.info]);

  const shouldEnableDiscreetMode = () => {
    if (!isDiscreetMode) return false;
    if (shouldEvaluateForOtherAccounts) {
      if (location.pathname.includes(routes.explorer.path)) {
        return isBlurHandledOnOtherWalletPage;
      }
      const { search } = location;
      if (selectSearchParamValue(search, 'modal') === 'transactionDetails') {
        return addresses.length
          ? addresses.includes(account.summary?.address)
          : isBlurHandledOnOtherWalletPage;
      }
    }
    return true;
  };

  const discreetModeClass = shouldEnableDiscreetMode() ? styles.discreetMode : '';
  return (
    <div className={classNames(discreetModeClass, className)}>
      {discreetModeClass.length ? <span className={styles.preformat} /> : ''}
      {children}
    </div>
  );
};

DiscreetMode.defaultProps = {
  location: {},
  addresses: [],
  shouldEvaluateForOtherAccounts: false,
};

DiscreetMode.propTypes = {
  className: PropTypes.string,
  account: PropTypes.object.isRequired,
  addresses: PropTypes.array,
  isDiscreetMode: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  shouldEvaluateForOtherAccounts: PropTypes.bool,
};

export default DiscreetMode;
