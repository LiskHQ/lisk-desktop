import React from 'react';
import AccountVisual from '../../toolbox/accountVisual';
import Icon from '../../toolbox/icon';
import reg from '../../../utils/regex';
import styles from './transactionTypeFigure.css';
import transactionTypes from '../../../constants/transactionTypes';

const TransactionTypeFigure = ({
  transactionType, address, avatarSize = 40, className = '', icon,
}) => {
  const validateAddress = () => !!reg.address.test(address);
  const txType = transactionTypes.getByCode(transactionType);

  const renderAvatar = () => (validateAddress()
    ? <AccountVisual address={address} size={avatarSize} />
    : null);

  return (
    <div className={`${styles.wrapper} ${className} transaction-image`}>
      { icon ? <Icon name={icon} className={styles.inOutIcon} /> : null }
      {
        transactionType === transactionTypes().transfer.code
          ? renderAvatar()
          : <Icon name={txType ? txType.icon : 'txDefault'} className={styles.transactionIcon} />
      }
    </div>
  );
};

export default TransactionTypeFigure;
