import React from 'react';

import { MODULE_ASSETS_NAME_ID_MAP, tokenMap } from '@constants';
import to from 'await-to-js';
import { createMultiSignatureTransaction } from '@api/transaction';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import MultiSignatureReview from '../../../shared/multiSignatureReview';
import ProgressBar from '../progressBar';
import styles from './styles.css';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;

const Summary = ({
  t,
  members,
  fee,
  account,
  network,
  mandatoryKeys,
  optionalKeys,
  numberOfSignatures,
  prevStep,
  nextStep,
  transactionCreatedSuccess,
  transactionCreatedError,
}) => {
  const submitTransaction = async () => {
    const [error, tx] = await to(
      createMultiSignatureTransaction({
        network,
        mandatoryKeys,
        optionalKeys,
        numberOfSignatures,
        moduleAssetId,
        fee,
        passphrase: account.passphrase,
        senderPublicKey: account.senderPublicKey,
      }, tokenMap.LSK.key),
    );

    if (!error) {
      transactionCreatedSuccess(tx);
      nextStep({ transactionInfo: tx });
    } else {
      transactionCreatedError(tx);
      nextStep({ transactionInfo: tx });
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
            numberOfSignatures={numberOfSignatures}
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
