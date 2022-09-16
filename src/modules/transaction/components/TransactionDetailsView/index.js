import React from 'react';
import { isEmpty } from 'src/utils/helpers';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Heading from 'src/modules/common/components/amountField/Heading';
import BoxHeader from 'src/theme/box/header';
import NotFound from './notFound';
import styles from './styles.css';
import TransactionEvents from '../TransactionEvents';

const TransactionDetails = ({ transaction: { error, isLoading, data }, containerStyle }) => {
  const { t } = useTranslation();
  if (!error && isEmpty(data)) {
    return <div />;
  }

  if (error && isEmpty(data)) {
    return <NotFound t={t} />;
  }
  return (
    <div className={styles.wrapper}>
      <Heading title="Transaction xxxx" className={styles.heading}/>
      <div className={styles.body}>
        <Box isLoading={isLoading} className={`${styles.container} ${containerStyle}`}>
          <BoxHeader>
            <h1>{t('Details')}</h1>
          </BoxHeader>
          <BoxContent>Transaction details</BoxContent>
        </Box>
        <Box isLoading={isLoading} className={`${styles.container} ${containerStyle}`}>
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

export default TransactionDetails;
