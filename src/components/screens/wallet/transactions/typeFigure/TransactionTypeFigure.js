import React from 'react';
import AccountVisual from '../../../../toolbox/accountVisual';
import Icon from '../../../../toolbox/icon';
import reg from '../../../../../utils/regex';
import styles from './transactionTypeFigure.css';
import transactionTypeIcons from '../../../../../constants/transactionTypeIcons';
import transactionTypes from '../../../../../constants/transactionTypes';

const TransactionTypeFigure = ({
  transactionType, address, avatarSize = 40, className = '',
}) => {
  const validateAddress = () => !!reg.address.test(address);

  const renderAvatar = () => (validateAddress()
    ? <AccountVisual address={address} size={avatarSize} />
    : null);

  return (
    <div className={`${styles.wrapper} ${className} transaction-image`}>
      {
        transactionType === transactionTypes.send
          ? renderAvatar()
          : <Icon name={transactionTypeIcons[transactionType] || transactionTypeIcons.default} />
      }
    </div>
  );
};

export default TransactionTypeFigure;
