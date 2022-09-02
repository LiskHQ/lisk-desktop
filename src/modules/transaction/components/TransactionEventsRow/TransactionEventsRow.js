import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import { TertiaryButton } from 'src/theme/buttons';
import styles from './TransactionEventsRow.css';

const EventId = ({ hash }) => (
  <div className={`event-hash ${styles.eventHash} ${grid['col-xs-6']}`}>
    <span>{hash}</span>
  </div>
);

const EventType = ({ action }) => (
  <div className={`${grid['col-xs-1']} event-action ${styles.eventAction}`}>
    {action}
  </div>
);

const EventModule = ({ module }) => (
  <div className={`${grid['col-xs-3']} event-action ${styles.eventAction}`}>
    {module}
  </div>
);

const EventIndex = ({ id }) => (
  <div className={grid['col-xs-1']}>
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
    id, data, module, typeID, index,
  } = transactionEvent;

  return (
    <div data-testid="transaction-event-row-wrapper" className={styles.rowWrapper}>
      <div className={`transaction-event-row ${styles.container}`}>
        <EventIndex id={index} />
        <EventId hash={id} />
        <EventModule module={module} />
        <EventType action={typeID} />
        <CollapseToggle
          isCollapsed={isCollapsed}
          onToggle={() => toggleCollapsed((state) => !state)}
        />
      </div>
      <div data-testid="transaction-event-json-viewer" className={`${styles.jsonContainer} ${!isCollapsed ? styles.shrink : ''}`}>
        <ReactJson src={data} />
      </div>
    </div>
  );
};

export default TransactionEventRow;
