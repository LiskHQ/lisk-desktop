import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import styles from './TransactionEventsRow.css';
import { EventIndex, EventModule, EventType, CollapseToggle } from './components';

const TransactionEventRow = ({ data: transactionEvent }) => {
  const [isCollapsed, toggleCollapsed] = useState(false);
  const { data, moduleName, typeID, index } = transactionEvent;

  return (
    <div data-testid="transaction-event-row-wrapper" className={styles.rowWrapper}>
      <div className={`transaction-event-row ${styles.container}`}>
        <EventIndex id={index} />
        <EventModule module={moduleName} />
        <EventType action={typeID} />
        <CollapseToggle
          isCollapsed={isCollapsed}
          onToggle={() => toggleCollapsed((state) => !state)}
        />
      </div>
      <div
        data-testid="transaction-event-json-viewer"
        className={`${styles.jsonContainer} ${!isCollapsed ? styles.shrink : ''}`}
      >
        <ReactJson name={false} src={data} />
      </div>
    </div>
  );
};

export default TransactionEventRow;
