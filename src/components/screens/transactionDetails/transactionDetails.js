import { withTranslation } from 'react-i18next';
import React from 'react';
import { useSelector } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { isEmpty } from '@utils/helpers';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import NotFound from '@shared/notFound';
import Dialog from '@toolbox/dialog/dialog';
import { selectCurrentBlockHeight } from '@store/selectors';
import TransactionVotes from './transactionVotes';
import {
  TransactionId, Sender, Recipient, Message,
  Illustration, AmountAndDate, FeeAndConfirmation,
  DelegateUsername,
} from './dataRows';
import styles from './transactionDetails.css';

const TransactionDetails = ({
  t, activeToken, transaction, votedDelegates,
}) => {
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const { error, isLoading, data } = transaction;
  const addresses = !isEmpty(data) && [data.asset.recipient?.address, data.sender.address];

  if (!error && isEmpty(transaction.data)) return <div />;
  if (error && isEmpty(transaction.data)) return <NotFound />;

  return (
    <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
      <Box isLoading={isLoading} className={styles.wrapper}>
        <BoxHeader>
          <h1>{t('Transaction details')}</h1>
        </BoxHeader>
        <BoxContent className={styles.mainContent}>
          <Illustration transaction={data} />
          <Sender
            transaction={data}
            activeToken={activeToken}
          />
          <Recipient
            transaction={data}
            activeToken={activeToken}
            t={t}
          />
          <TransactionId t={t} id={data.id} />
          <AmountAndDate
            transaction={data}
            activeToken={activeToken}
            addresses={addresses}
            t={t}
          />
          <FeeAndConfirmation
            transaction={data}
            activeToken={activeToken}
            addresses={addresses}
            t={t}
            currentBlockHeight={currentBlockHeight}
          />
          <Message activeToken={activeToken} transaction={data} t={t} />
          <TransactionVotes transaction={data} t={t} votedDelegates={votedDelegates} />
          <DelegateUsername transaction={data} t={t} />
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default withTranslation()(TransactionDetails);
