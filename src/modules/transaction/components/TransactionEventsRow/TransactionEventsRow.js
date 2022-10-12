import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import styles from './TransactionEventsRow.css';
import {
  EventIndex,
  EventModule,
  EventName,
  CollapseToggle,
  BlockHeight,
  TransctionID,
} from './components';

const TransactionEventRow = ({ data: transactionEvent, isWallet }) => {
  const [isCollapsed, toggleCollapsed] = useState(false);
  const {
    data,
    module,
    name,
    index,
    topics,
    block: { height, id },
  } = transactionEvent;

  return (
    <div data-testid="transaction-event-row-wrapper" className={styles.rowWrapper}>
      <div className={`transaction-event-row ${styles.container}`}>
        {isWallet ? <BlockHeight height={height} id={id} /> : <EventIndex id={index} />}
        {isWallet && <TransctionID id={topics[0]} />}
        <EventModule module={module} isWallet={isWallet} />
        <EventName name={name} isWallet={isWallet}  />
        <CollapseToggle
          isWallet={isWallet} 
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
