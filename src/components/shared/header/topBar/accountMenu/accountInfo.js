import React from 'react';
import PropTypes from 'prop-types';
import { tokenMap } from '../../../../../constants/tokens';
import Icon from '../../../../toolbox/icon';
import styles from './userAccount.css';
import LiskAmount from '../../../liskAmount';
import DiscreetMode from '../../../discreetMode';

const AccountInfo = ({
  account, token, t, className, ...props
}) => (
  <div className={`${styles.accountInfo} ${className}`} {...props}>
    <Icon name={`${tokenMap[token].icon}Icon`} />
    <div>
      <p>{t('{{token}} Wallet', { token: tokenMap[token].label })}</p>
      <DiscreetMode>
        <span className="balance">
          <LiskAmount val={account.balance} />
          {' '}
          {tokenMap[token].key}
        </span>
      </DiscreetMode>
    </div>
  </div>
);

AccountInfo.displayName = 'AccountInfo';

AccountInfo.propTypes = {
  account: PropTypes.shape({
    balance: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  className: PropTypes.string,
};

AccountInfo.defaultProps = {
  className: '',
};

export default AccountInfo;
