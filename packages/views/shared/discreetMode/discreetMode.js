import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { routes } from '@constants';
import { selectSearchParamValue } from '@utils/searchParams';
import styles from './discreetMode.css';

class DiscreetMode extends Component {
  handleBlurOnOtherWalletPage() {
    const { account, location: { search }, token } = this.props;
    const address = selectSearchParamValue(search, routes.account.searchParam);
    return account.info && address === account.info[token].address;
  }

  shouldEnableDiscreetMode() {
    const {
      location, isDiscreetMode, shouldEvaluateForOtherAccounts,
      addresses, account,
    } = this.props;
    if (!isDiscreetMode) return false;
    if (shouldEvaluateForOtherAccounts) {
      if (location.pathname.includes(routes.account.path)) {
        return this.handleBlurOnOtherWalletPage();
      }
      const { location: { search } } = this.props;
      if (selectSearchParamValue(search, 'modal') === 'transactionDetails') {
        return addresses.length
          ? addresses.includes(account.summary?.address)
          : this.handleBlurOnOtherWalletPage();
      }
    }
    return true;
  }

  render() {
    const discreetModeClass = this.shouldEnableDiscreetMode() ? styles.discreetMode : '';
    return (
      <div className={discreetModeClass}>
        {discreetModeClass.length ? <span className={styles.preformat} /> : ''}
        {this.props.children}
      </div>
    );
  }
}

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
