import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Table from '../../../toolbox/table';
import DialogLink from '../../../toolbox/dialog/link';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import AccountVisual from '../../../toolbox/accountVisual';
import Icon from '../../../toolbox/icon';
import TransactionAmount from '../../../shared/transactionAmount';
// import regex from '../../../../utils/regex';
import styles from './multiSignature.css';

const header = t => (
  [
    {
      title: t('Sender'),
      classList: grid['col-xs-4'],
    },
    {
      title: t('Recipient'),
      classList: grid['col-xs-4'],
    },
    {
      title: t('Amount'),
      classList: grid['col-xs-2'],
    },
    {
      title: '',
      classList: grid['col-xs-2'],
    },
  ]
);

const TransactionRow = ({ data, t, host }) => {
  const {
    sender,
    recipient,
    amount,
  } = data;

  return (
    <DialogLink className={`${grid.row} ${styles.transactionRow} transactions-row`}>
      <span className={grid['col-xs-4']}>
        <Icon
          name="incoming"
          className={styles.incomingOutcomingIcon}
        />
        <AccountVisual
          address={sender.address}
          className={styles.avatar}
        />
        <div className={styles.senderDetails}>
          <p className={styles.addressTitle}>
            {sender.name || sender.address}
          </p>
          <p className={styles.senderKey}>
            {sender.publicKey && sender.publicKey}
          </p>
        </div>
      </span>
      <span className={grid['col-xs-4']}>
        <AccountVisual
          address={recipient.address}
          className={styles.avatar}
        />
        <p className={styles.addressTitle}>
          {recipient.address}
        </p>
      </span>
      <span className={grid['col-xs-2']}>
        <TransactionAmount
          token="LSK"
          showRounded
          sender={sender.address}
          recipient={recipient.address}
          type={0}
          amount={amount}
          host={host}
        />
      </span>
      <span className={grid['col-xs-2']}>
        <p className={styles.status}>{t('Sign and share')}</p>
      </span>
    </DialogLink>
  );
};

const MultiSignature = ({
  transactions = [
    {
      sender: { address: '7775299921311136181L', publicKey: '8155694652104526882', title: 'Wilson Geidt' },
      recipient: { address: '6195226421328336181L' },
      amount: 10000000000,
    },
    {
      sender: { address: '6195226421328336181L' },
      recipient: { address: '5059876081639179984L' },
      amount: 2000000000,
    },
    {
      sender: { address: '5195226421328336181L' },
      recipient: { address: '1295226421328336181L' },
      amount: 50000000000,
    },
  ],
  t = key => key,
}) => (
  <Box>
    <BoxHeader>
      <h2>Pending multisignature transactions</h2>
    </BoxHeader>
    <BoxContent>
      <Table
        data={transactions}
        row={TransactionRow}
        header={header(t)}
        additionalRowProps={{ t, host: '5059876081639179984L' }}
      />
    </BoxContent>
  </Box>
);

export default MultiSignature;
