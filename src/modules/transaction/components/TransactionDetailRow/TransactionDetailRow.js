import React from 'react';
import { AddressWithName, ExpandToggle, Text, Title, TransactionStatus } from './components';
import styles from './TransactionDetailRow.css';

const TransactionEventRow = ({ data, isParamsCollasped, onToggleJsonView }) => {
  const { type, tooltip, value, title, isCapitalized } = data;

  const valueToRender = {
    address: <AddressWithName {...value} />,
    status: <TransactionStatus status={value} />,
    expand: <ExpandToggle isCollapsed={isParamsCollasped} onToggle={onToggleJsonView} />,
  };

  return (
    <div data-testid="transaction-event-row-wrapper" className={styles.container}>
      <Title tooltip={tooltip} text={title} />
      {valueToRender[type] || <Text isCapitalized={isCapitalized} value={value} />}
    </div>
  );
};

export default TransactionEventRow;
