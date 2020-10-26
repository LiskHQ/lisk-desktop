import React from 'react';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import MultiSignatureReview from '../../../shared/multiSignatureReview';
import ProgressBar from '../progressBar';
import styles from './styles.css';

const ReviewSign = ({ t, prevStep, nextStep }) => {
  const submitTransaction = () => {
    const [error, tx] = [false, { id: 1 }];

    if (!error) {
      nextStep({ transactionInfo: tx });
    } else {
      nextStep({ error });
    }
  };

  return (
    <section>
      <Box className={styles.container}>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>{t('If you have received a multisignature transaction that requires your signature, use this tool to review and sign it.')}</p>
        </header>
        <BoxContent>
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

export default ReviewSign;
