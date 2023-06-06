import React from 'react';
import { Link } from 'react-router-dom';
import CopyToClipboard from '@common/components/copyToClipboard';
import routes from 'src/routes/routes';
import { AddressWithName, ExpandToggle, Text, Title, TransactionStatus } from './components';
import styles from './TransactionDetailRow.css';

const TransactionEventRow = ({ data, isParamsCollapsed, onToggleJsonView }) => {
  const { type, tooltip, value, label, isCapitalized, canCopy, redirectLink } = data;

  const valueToRender = {
    address: (
      <Link to={`${routes.wallet.path}?address=${value?.address}`}>
        <AddressWithName {...value} />
      </Link>
    ),
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
