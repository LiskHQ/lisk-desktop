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
  Illustration, Confirmations, Date, Amount, Fee, RequiredSignatures, Nonce,
} from './components';
import styles from './transactionDetails.css';
import transactionTypes from '../../../constants/transactionTypes';

const getDelegateName = (transaction, activeToken) => (
  (activeToken === 'LSK'
  && transaction.asset
  && transaction.asset.delegate
  && transaction.asset.delegate.username) ? transaction.asset.delegate.username : null
);

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
        <BoxContent className={`${styles.mainContent} ${styles.multiSigLayout}`}>
          <Illustration type={data.type} senderId={data.senderId} title={title} />
          <Sender
            senderId={data.senderId}
            delegateName={getDelegateName(data, activeToken)}
            senderLabel={senderLabel}
            activeToken={activeToken}
            netCode={netCode}
          />
          <Recipient
            recipientId={data.recipientId}
            activeToken={activeToken}
            netCode={netCode}
            t={t}
          />
          <TransactionId t={t} id={data.id} />
          <Amount
            t={t}
            amount={data.amount}
            addresses={addresses}
            activeToken={activeToken}
          />
          <Date t={t} timestamp={data.timestamp} activeToken={activeToken} />
          <Fee t={t} fee={data.fee} activeToken={activeToken} />
          <Confirmations
            t={t}
            confirmations={data.confirmations}
            activeToken={activeToken}
          />
          <RequiredSignatures t={t} requiredSignatures={data.requiredSignatures} />
          <Nonce t={t} nonce={data.nonce} />
          <Message activeToken={activeToken} transaction={data} t={t} />
          {/* <TransactionVotes transaction={data} t={t} delegates={delegates} /> */}
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default TransactionDetails;
