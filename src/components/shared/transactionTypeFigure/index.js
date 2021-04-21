import React from 'react';
import { MODULE_ASSETS_NAME_ID_MAP, MODULE_ASSETS_MAP } from '@constants';
import { validateAddress } from '@utils/validators';
import AccountVisual from '@toolbox/accountVisual';
import Icon from '@toolbox/icon';
import styles from './transactionTypeFigure.css';

const TransactionTypeFigure = ({
  moduleAssetId, address, avatarSize = 40, className = '', icon,
}) => {
  const renderAvatar = () => {
    if (validateAddress(address)) {
      return <AccountVisual address={address} size={avatarSize} />;
    }
    return null;
  };

  return (
    <div className={`${styles.wrapper} ${className} transaction-image`}>
      { icon ? <Icon name={icon} className={styles.inOutIcon} /> : null }
      {
        moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer
          ? renderAvatar()
          : <Icon name={MODULE_ASSETS_MAP[moduleAssetId].icon} className={styles.transactionIcon} />
      }
    </div>
  );
};

export default TransactionTypeFigure;
