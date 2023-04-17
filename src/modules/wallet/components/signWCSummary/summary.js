/* eslint-disable complexity */
/* eslint-disable max-statements */
import React from 'react';
import BoxContent from 'src/theme/box/content';
import Box from 'src/theme/box';
import Footer from '@transaction/components/TxSummarizer/footer';
import { LayoutSchema } from '@transaction/components/TransactionDetails/layoutSchema';
import TransactionDetailsContext from '@transaction/context/transactionDetailsContext';
import layoutSchemaStyles from '@transaction/components/TransactionDetails/layoutSchema.css';
import styles from './styles.css';

const Summary = (props) => {
  const {
    t,
    transactionJSON,
    formProps,
    nextStep,
    prevStep,
  } = props;
  const wallet = {};
  const confirmButton = {
    label: t('Send'),
    onClick: () => {
      nextStep({
        formProps,
        transactionJSON,
        selectedPriority: 'normal',
        actionFunction: () => {},
      });
    },
  };
  const cancelButton = {
    label: t('Go back'),
    onClick: () => {
      prevStep({ formProps });
    },
  };

  const Layout = LayoutSchema.structuredGeneralLayout;

  return (
    <Box className={styles.boxContainer}>
      <header>
        <h1>{t('Transaction summary')}</h1>
        <p>
          {t('Please review and verify the transaction details before signing.')}
        </p>
      </header>
      <BoxContent>
        <Box className={`${styles.container} ${styles.txDetails}`}>
          <BoxContent className={`${layoutSchemaStyles.mainContent} ${Layout.className}`}>
            <TransactionDetailsContext.Provider
              value={{
                transaction: {
                  ...transactionJSON,
                  moduleCommand: 'token:transfer',
                },
              }}
            >
              {Layout.components.map((Component, index) => (
                <Component key={index} t={t} />
              ))}
            </TransactionDetailsContext.Provider>
          </BoxContent>
        </Box>
        <Footer
          cancelButton={cancelButton}
          confirmButton={confirmButton}
          account={wallet}
          confirmButtonText={t('Send')}
          cancelButtonText={t('Go back')}
          t={t}
        />
      </BoxContent>
    </Box>
  );
};
export default Summary;
