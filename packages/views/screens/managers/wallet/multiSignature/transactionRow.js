import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { regex } from '@common/configuration';
import { tokenMap } from '@token/configuration/tokens';
import DialogLink from '@basics/dialog/link';
import WalletVisual from '@wallet/detail/identity/walletVisual';
import Icon from '@basics/icon';
import TransactionAmount from '@transaction/detail/info/transactionAmount';
import styles from './multiSignature.css';

const ActionButton = ({ status, t }) => (
  <DialogLink>
    {(() => {
      switch (status) {
        case 1:
          return <p className={styles.status}>{t('Sign and share')}</p>;
        case 2:
          return <p className={styles.status}>{t('Sign and send')}</p>;
        case 3:
          return <p className={styles.status}>{t('View remaining')}</p>;
        default:
          return null;
      }
    })()}
  </DialogLink>
);

const TransactionRow = ({
  data,
  t,
  host,
  className,
}) => {
  const {
    sender,
    recipient,
    amount,
    status,
  } = data;

  return (
    <DialogLink className={`${grid.row} ${className} ${styles.transactionRow} multisign-transaction-row`}>
      <span className={grid['col-xs-4']}>
        <Icon
          name={host === recipient.address ? 'incoming' : 'outgoing'}
          className={styles.incomingOutcomingIcon}
        />
        <WalletVisual
          address={sender.address}
          className={styles.avatar}
        />
        <div className={styles.signDetails}>
          <p className={styles.addressTitle}>
            {sender.title || sender.address.replace(regex.lskAddressTrunk, '$1...$3')}
          </p>
          {sender.publicKey && <p className={styles.key}>{sender.publicKey.replace(regex.lskAddressTrunk, '$1...$3')}</p>}
        </div>
      </span>
      <span className={grid['col-xs-4']}>
        <WalletVisual
          address={recipient.address}
          className={styles.avatar}
        />
        <p className={styles.addressTitle}>
          {recipient.address.replace(regex.lskAddressTrunk, '$1...$3')}
        </p>
      </span>
      <span className={grid['col-xs-2']}>
        <TransactionAmount
          token={tokenMap.LSK.key}
          showRounded
          sender={sender.address}
          recipient={recipient.address}
          type={0}
          amount={amount}
          host={host}
        />
      </span>
      <span className={grid['col-xs-2']}>
        <ActionButton status={status} t={t} />
      </span>
    </DialogLink>
  );
};

export default TransactionRow;
