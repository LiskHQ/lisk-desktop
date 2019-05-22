// istanbul ignore file
import React from 'react';
import AccountVisual from '../accountVisual';
import svg from '../../utils/svgIcons';
import reg from '../../utils/regex';
import styles from './transactionTypeFigure.css';

const TransactionTypeFigure = ({
  transactionType, address, avatarSize = 40, className = '',
}) => {
  const renderTxIconType = () => {
    let icon = '';

    switch (transactionType) {
      case 0:
        return <AccountVisual address={address} size={avatarSize}/>;
      case 1:
        icon = svg.tx2ndPassphrase;
        break;
      case 2:
        icon = svg.txDelegate;
        break;
      case 3:
        icon = svg.txVote;
        break;
      default:
        icon = svg.txDefault;
        break;
    }

    return <img src={icon} />;
  };

  const validateAddress = () => {
    if (reg.address.test(address)) return true;
    return false;
  };

  return (
    <div className={`${styles.wrapper} ${className} transaction-image`}>
      {
        validateAddress()
          ? renderTxIconType()
          : null
      }
    </div>
  );
};

export default TransactionTypeFigure;
