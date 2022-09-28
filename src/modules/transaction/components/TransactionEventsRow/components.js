import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import { truncateTransactionID } from 'src/modules/wallet/utils/account';
import { Link } from 'react-router-dom';

import { TertiaryButton } from 'src/theme/buttons';
import styles from './TransactionEventsRow.css';

export const EventId = ({ hash }) => (
  <div className={`event-hash ${styles.eventHash} ${grid['col-xs-6']}`}>
    <span>{hash}</span>
  </div>
);

export const TransctionID = ({ id }) => (
  <div className={`event-hash ${styles.transactionID} ${grid['col-xs-4']}`}>
    <Link to={`/transactions/details?transactionID=${id}`}>
      {id.length === 64 ? truncateTransactionID(id) : '-'}
    </Link>
  </div>
);

export const BlockHeight = ({ height, id }) => (
  <div className={`event-hash ${styles.blockHeight} ${grid['col-xs-2']}`}>
    <Link to={`/block?id=${id}`}>{height}</Link>
  </div>
);

export const EventName = ({ name, isWallet }) => (
  <div className={`${grid[`col-xs-${isWallet ? 2 : 3}`]} event-action ${styles.eventAction}`}>
    {name}
  </div>
);

export const EventModule = ({ module, isWallet }) => (
  <div className={`${grid[`col-xs-${isWallet ? 3 : 4}`]} event-action ${styles.eventAction}`}>
    {module}
  </div>
);

export const EventIndex = ({ id }) => <div className={grid['col-xs-4']}>{id}</div>;

export const CollapseToggle = ({ isCollapsed, onToggle }) => (
  <div className={`${styles.toggleButton} ${grid['col-xs-1']}`}>
    <TertiaryButton onClick={onToggle}>
      <Icon name="arrowRightInactive" className={isCollapsed ? styles.collapsed : ''} />
    </TertiaryButton>
  </div>
);
