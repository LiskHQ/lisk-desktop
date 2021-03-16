import React from 'react';
import reg from '@utils/regex';
import { MODULE_ASSETS } from '@constants';
import AccountVisual from '../../toolbox/accountVisual';
import Icon from '../../toolbox/icon';
import styles from './transactionTypeFigure.css';

const TransactionTypeFigure = ({
  transactionType, address, avatarSize = 40, className = '', icon,
}) => {
  const validateAddress = () => !!reg.address.test(address);

  const renderAvatar = () => (validateAddress()
    ? <AccountVisual address={address} size={avatarSize} />
    : null);

  return (
    <div className={`${styles.wrapper} ${className} transaction-image`}>
      { icon ? <Icon name={icon} className={styles.inOutIcon} /> : null }
      {
        transactionType === MODULE_ASSETS().transfer.key
          ? renderAvatar()
          : <Icon name={transactionType || 'txDefault'} className={styles.transactionIcon} />
      }
    </div>
  );
};

export default TransactionTypeFigure;
