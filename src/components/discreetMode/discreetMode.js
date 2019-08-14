import React, { Component } from 'react';
import PropTypes from 'prop-types';
import routes from '../../constants/routes';
import styles from './discreetMode.css';
import { getTokenFromAddress } from '../../utils/api/transactions';

class DiscreetMode extends Component {
  // eslint-disable-next-line max-statements
  shouldBlurElement() {
    const {
      account,
      addresses,
      location,
      isDiscreetMode,
    } = this.props;

    if (!isDiscreetMode) return false;

    const { pathname } = location;
    if (addresses.length && pathname.includes(routes.transactions.path)) {
      const token = getTokenFromAddress(addresses[0]);
      return account.info && addresses.some(address => address === account.info[token].address);
    }

    if (pathname.includes(routes.accounts.path)) {
      const address = pathname.split('/').pop();
      const token = getTokenFromAddress(address);
      return account.info && address === account.info[token].address;
    }

    return true;
  }

  render() {
    const discreetModeClass = this.shouldBlurElement() ? styles.discreetMode : '';
    return <div className={discreetModeClass}>{this.props.children}</div>;
  }
}

/* istanbul ignore next */
DiscreetMode.defaultProps = {
  addresses: [],
};

DiscreetMode.propTypes = {
  account: PropTypes.object.isRequired,
  addresses: PropTypes.array,
  isDiscreetMode: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
};


export default DiscreetMode;
