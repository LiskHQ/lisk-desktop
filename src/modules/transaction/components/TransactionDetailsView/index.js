import React from 'react';
import { isEmpty } from 'src/utils/helpers';
import { useTranslation } from 'react-i18next';
import { parseSearchParams } from 'src/utils/searchParams';
import { withRouter } from 'react-router';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Heading from 'src/modules/common/components/amountField/Heading';
import BoxHeader from 'src/theme/box/header';
import NotFound from './notFound';
import styles from './styles.css';
import TransactionEvents from '../TransactionEvents';
import { useTransactions } from '../../hooks/queries';

const TransactionDetails = ({ location }) => {
  const transactionId = parseSearchParams(location.search).transactionId;
  const { t } = useTranslation();

  const {
    data: transactions,
    error,
    isLoading,
  } = useTransactions({
    config: {
      params: {
        id: transactionId,
      },
    },
  });

  if (error && isEmpty(transactions?.data)) {
    return <NotFound t={t} />;
  }
  return (
    <div className={styles.wrapper}>
      <Heading title="Transaction xxxx" className={styles.heading} />
      <div className={styles.body}>
        <Box isLoading={isLoading} className={styles.container}>
          <BoxHeader>
            <h1>{t('Details')}</h1>
          </BoxHeader>
          <BoxContent>Transaction details</BoxContent>
        </Box>
        <Box isLoading={isLoading} className={styles.container}>
          <BoxHeader>
            <h1>{t('Events')}</h1>
          </BoxHeader>
          <BoxContent>
            <TransactionEvents />
          </BoxContent>
        </Box>
      </div>
    </div>
  );
};

export default withRouter(TransactionDetails);
