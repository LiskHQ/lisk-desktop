import React, { useState } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import { TertiaryButton } from 'src/theme/buttons';
import styles from './TransactionEventsRow.css';

const EventHash = ({ hash }) => (
  <div className={`event-hash ${styles.eventHash} ${grid['col-xs-6']}`}>
    <span>{hash}</span>
  </div>
);

const EventAction = ({ action }) => (
  <div className={`${grid['col-xs-3']} event-action ${styles.eventAction}`}>
    {action}
  </div>
);

const EventId = ({ id }) => (
  <div className={grid['col-xs-2']}>
    {id}
  </div>
);

const CollapseToggle = ({ isCollapsed, onToggle }) => (
  <div className={`${styles.toggleButton} ${grid['col-xs-1']}`}>
    <TertiaryButton
      onClick={onToggle}
    >
      <Icon name="arrowRightInactive" className={isCollapsed ? styles.collapsed : ''} />
    </TertiaryButton>
  </div>
);

const TransactionEventRow = ({ data: transactionEvent }) => {
  const [isCollapsed, toggleCollapsed] = useState(false);
  const {
    id, data, action, hash,
  } = transactionEvent;

  return (
    <div className={styles.rowWrapper}>
      <div data-testid="transaction-event-row" className={`transaction-event-row ${styles.container}`}>
        <EventId id={id} />
        <EventHash hash={hash} />
        <EventAction action={action} />
        <CollapseToggle
          isCollapsed={isCollapsed}
          onToggle={() => toggleCollapsed((state) => !state)}
        />
      </div>
      <div className={`${styles.jsonContainer} ${!isCollapsed ? styles.collapsed : ''}`}>
        <span>{JSON.stringify(data)}</span>
      </div>
    </div>
  );
};

export default TransactionEventRow;
