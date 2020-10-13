import React, { useEffect } from 'react';

import LiskAmount from '../../../shared/liskAmount';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import Piwik from '../../../../utils/piwik';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';

import styles from './styles.css';

const InfoColumn = ({ title, children }) => (
  <div className={styles.infoColumn}>
    <span className={styles.infoTitle}>{title}</span>
    <span className={styles.infoValue}>
      {children}
    </span>
  </div>
);

const Summary = ({
  t, members, fee, requiredSignatures, account, prevStep, nextStep, transactions, ...props
}) => {
  useEffect(() => {
    if (!transactions.transactionsCreatedFailed.length
      && transactions.transactionsCreated.length) {
      nextStep({
        error: false,
      });
    } else if (transactions.transactionsCreatedFailed.length) {
      nextStep({
        error: true,
      });
    }
  }, [transactions]);

  const submitTransaction = () => {
    Piwik.trackingEvent('MultiSig_SubmitTransaction', 'button', 'Sign');

    // @todo call actions that submit the transaction
  };

  return (
    <section>
      <Box className={styles.container}>
        <BoxContent className={styles.content}>
          {/* add signing members here */}
          <div className={styles.infoContainer}>
            <InfoColumn title={t('Required Signatures')}>{requiredSignatures}</InfoColumn>
            <InfoColumn title={t('Transaction fee')}>
              <LiskAmount val={fee} />
            </InfoColumn>
          </div>
        </BoxContent>
        <BoxFooter className={styles.footer} direction="horizontal">
          <SecondaryButton onClick={prevStep}>Edit</SecondaryButton>
          <PrimaryButton size="l" onClick={submitTransaction}>
            {t('Sign')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Summary;
