import React from 'react';
import { MODULE_ASSETS_NAME_ID_MAP, MODULE_ASSETS_MAP, tokenMap } from '@constants';
import { validateAddress } from '@utils/validators';
import AccountVisual from '@views/basics/accountVisual';
import Icon from '@views/basics/icon';
import styles from './transactionTypeFigure.css';

const TransactionTypeFigure = ({
  moduleAssetId, address, avatarSize = 40, className = '', icon, iconOnly,
}) => {
  const renderAvatar = () => {
    if (validateAddress(tokenMap.LSK.key, address) === 0) {
      return <AccountVisual address={address} size={avatarSize} />;
    }
    return null;
  };

  return (
    <div className={`${styles.wrapper} ${className} transaction-image`}>
      { icon ? <Icon name={icon} className={styles.inOutIcon} /> : null }
      {
        moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer && !iconOnly
          ? renderAvatar()
          : (
            <Icon
              name={MODULE_ASSETS_MAP[moduleAssetId]?.icon ?? 'txDefault'}
              className={styles.transactionIcon}
            />
          )
      }
    </div>
  );
};

export default TransactionTypeFigure;
