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
  members = [
    {
      name: 'Wilson Geidt', address: '8195226425328336181L', publicKey: '8155694652104526882', mandatory: true,
    },
    { address: '6195226421328336181L', publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', mandatory: false },
    { address: '4827364921328336181L', publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', mandatory: false },
  ],
  fee = 15000000, // rawLSK
  requiredSignatures = 2,
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
          <MultiSignatureReview
            t={t}
            members={members}
            fee={fee}
            requiredSignatures={requiredSignatures}
          />
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
