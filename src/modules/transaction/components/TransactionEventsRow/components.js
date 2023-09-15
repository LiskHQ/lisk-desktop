import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import { truncateTransactionID } from 'src/modules/wallet/utils/account';

import { TertiaryButton } from 'src/theme/buttons';
import styles from './TransactionEventsRow.css';

export const TransactionID = ({ id }) => (
  <div className={`event-hash ${styles.transactionID} ${grid['col-xs-3']}`}>
    {id.length === 64 ? (
      <Link to={`/transactions/details?transactionID=${id}`}>{truncateTransactionID(id)}</Link>
    ) : (
      '-'
    )}
  </div>
);

export const BlockHeight = ({ height, id }) => (
  <div className={`event-hash ${styles.blockHeight} ${grid['col-xs-2']}`}>
    <Link to={`/block?id=${id}`}>{height}</Link>
  </div>
);

export const EventName = ({ name, isWallet }) => (
  <div className={`${grid[`col-xs-${isWallet ? 3 : 4}`]} event-action ${styles.eventAction}`}>
    {name || '-'}
  </div>
);

export const EventModule = ({ module, isWallet }) => (
  <div className={`${grid[`col-xs-${isWallet ? 3 : 4}`]} event-action ${styles.eventAction}`}>
    {module || '-'}
  </div>
);

export const EventIndex = ({ index }) => (
  <div className={grid['col-xs-3']}>{index !== undefined || index !== null ? index : '-'}</div>
);

export const CollapseToggle = ({ isCollapsed, onToggle }) => (
  <div className={`${styles.toggleButton} ${grid['col-xs-1']}`}>
    <TertiaryButton onClick={onToggle}>
      <Icon name="arrowRightInactive" className={isCollapsed ? styles.collapsed : ''} />
    </TertiaryButton>
  </div>
);
