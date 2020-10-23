import React from 'react';

import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import Piwik from '../../../../utils/piwik';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import MultiSignatureReview from '../../../shared/multiSignatureReview';

import ProgressBar from '../progressBar';
import styles from './styles.css';

const Summary = ({
  t,
  // account,
  // network,
  prevStep,
  nextStep,
  transactionCreatedSuccess,
  transactionCreatedError,
}) => {
  const submitTransaction = () => {
    Piwik.trackingEvent('MultiSig_SubmitTransaction', 'button', 'Sign');
    // const txData = {
    //  nonce: account.nonce,
    //  fee: `${fee}`,
    //  network,
    // };

    // const [error, tx] = await to(
    //   create(txData, transactionTypes().unlockToken.key),
    // );
    const [error, tx] = [false, { id: 1 }];

    if (!error) {
      transactionCreatedSuccess(tx);
      nextStep({ transactionInfo: tx });
    } else {
      transactionCreatedError(error);
      nextStep({ error });
    }
  };

  return (
    <section className={styles.wrapper}>
      <Box className={styles.container}>
        <div className={styles.header}>
          <h1>{t('Register multisignature account')}</h1>
        </div>
        <BoxContent className={styles.content}>
          <ProgressBar current={2} />
          <MultiSignatureReview t={t} />
        </BoxContent>
        <BoxFooter className={styles.footer} direction="horizontal">
          <SecondaryButton className="go-back" onClick={prevStep}>{t('Edit')}</SecondaryButton>
          <PrimaryButton className="confirm" size="l" onClick={submitTransaction}>
            {t('Sign')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Summary;
