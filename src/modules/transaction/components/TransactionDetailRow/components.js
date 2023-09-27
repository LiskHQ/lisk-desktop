import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTranslation } from 'react-i18next';
import Tooltip from 'src/theme/Tooltip';
import { TertiaryButton } from 'src/theme/buttons';
import WalletVisual from 'src/modules/wallet/components/walletVisual';
import { truncateAddress } from 'src/modules/wallet/utils/account';
import styles from './TransactionDetailRow.css';

export const Text = ({ value, isCapitalized, redirectTo }) => (
  <div className={`${styles.text} ${isCapitalized ? styles.capitalized : ''} ${grid['col-xs-7']}`}>
    <span>{redirectTo?.length ? <Link to={redirectTo}>{value}</Link> : value}</span>
  </div>
);

export const ExpandToggle = ({ isCollapsed, onToggle }) => {
  const { t } = useTranslation();

  return (
    <TertiaryButton
      onClick={onToggle}
      className={`${styles.expandToggle} ${isCollapsed ? styles.collapsed : ''} ${
        grid['col-xs-5']
      }`}
    >
      <span>{isCollapsed ? t('Close') : t('Expand')}</span>
    </TertiaryButton>
  );
};

export const Title = ({ tooltip, label }) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.title} ${grid['col-xs-5']}`}>
      <span>{label}</span>
      {tooltip && (
        <Tooltip position="right" indent>
          <p>{t(tooltip)}</p>
        </Tooltip>
      )}
    </div>
  );
};

export const AddressWithName = ({ address, name }) => (
  <div className={`${styles.addressWrapper}`}>
    <WalletVisual address={address} />
    <div>
      <p className={styles.name}>{name}</p>
      <p className={styles.address}>{truncateAddress(address)}</p>
    </div>
  </div>
);

export const TransactionStatus = ({ status }) => (
  <div className={`${styles.statusWrapper} ${grid['col-xs-7']}`}>
    <span className={`${styles.transactionStatus} ${styles[status]}`}>{status}</span>
  </div>
);
