import React from 'react';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import { AddressWithName, ExpandToggle, Text, Title, TransactionStatus } from './components';
import styles from './TransactionDetailRow.css';

const TransactionEventRow = ({ data, isParamsCollapsed, onToggleJsonView }) => {
  const { type, tooltip, value, label, isCapitalized, canCopy, redirectLink } = data;

  const valueToRender = {
    address: <AddressWithName {...value} />,
    status: <TransactionStatus status={value} />,
    expand: <ExpandToggle isCollapsed={isParamsCollapsed} onToggle={onToggleJsonView} />,
  };

  return (
    <div data-testid="transaction-event-row-wrapper" className={styles.container}>
      <Title tooltip={tooltip} label={label} />
      {valueToRender[type] || (
        <Text redirectTo={redirectLink} isCapitalized={isCapitalized} value={value} />
      )}
      {canCopy && (
        <CopyToClipboard
          value={value}
          type="icon"
          copyClassName={styles.copyIcon}
          className={styles.copyIcon}
        />
      )}
    </div>
  );
};

export default TransactionEventRow;
