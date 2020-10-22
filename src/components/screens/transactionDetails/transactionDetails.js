import React, { useEffect } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxContent from '../../toolbox/box/content';
import NotFound from '../../shared/notFound';
import TransactionVotes from './transactionVotes';
import routes from '../../../constants/routes';
import { isEmpty } from '../../../utils/helpers';
import Dialog from '../../toolbox/dialog/dialog';

import {
  TransactionId, Sender, Recipient, Message,
  Illustration, Confirmations, Date, Amount, Fee, ValueAndLabel,
} from './dataRows/baseComponents';
import styles from './transactionDetails.css';
import transactionTypes from '../../../constants/transactionTypes';

const TransactionDetails = ({
  t, activeToken, netCode, transaction, delegates, history,
}) => {
  useEffect(() => {
    // history.push(routes.dashboard.path);
  }, [activeToken]);

  const { error, isLoading, data } = transaction;
  const addresses = data && [data.recipientId, data.senderId];

  if (!error && isEmpty(transaction.data)) {
    return <div />;
  }

  if (error && isEmpty(transaction.data)) {
    return <NotFound />;
  }

  const { title } = transactionTypes.getByCode(transaction.type || 0);
  const { senderLabel } = transactionTypes.getByCode(transaction.type || 0);

  return (
    <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
      <Box isLoading={isLoading} className={styles.wrapper}>
        <BoxHeader>
          <h1>{t('Transaction details')}</h1>
        </BoxHeader>
        <BoxContent className={styles.mainContent}>
          <Illustration type={transaction.type} senderId={data.senderId} title={title} />
          <Sender
            senderId={data.senderId}
            // delegateName="name"
            senderLabel={senderLabel}
            activeToken={activeToken}
            netCode={netCode}
          />
          <Recipient
            recipientId={data.recepientId}
            activeToken={activeToken}
            netCode={netCode}
            t={t}
          />
          <TransactionId t={t} id={data.id} />
          <Amount
            t={t}
            amount={transaction.amount}
            addresses={addresses}
            activeToken={activeToken}
          />
          <Date t={t} timestamp={transaction.timestamp} activeToken={activeToken} />
          <Fee t={t} fee={transaction.fee} activeToken={activeToken} />
          <Confirmations
            t={t}
            confirmations={transaction.confirmations}
            activeToken={activeToken}
          />
          {/* <ValueAndLabel label={t('Required Signatures')}>
            <span>{transaction.requiredSignatures}</span>
          </ValueAndLabel>
          <ValueAndLabel label={t('Nonce')}>
            <span>{transaction.nonce}</span>
          </ValueAndLabel> */}
          <Message activeToken={activeToken} transaction={data} t={t} />
          {/* <TransactionVotes transaction={data} t={t} delegates={delegates} /> */}
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default TransactionDetails;
