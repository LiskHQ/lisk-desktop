import React from 'react';

import { MODULE_ASSETS_NAME_ID_MAP, tokenMap } from '@constants';
import to from 'await-to-js';
import { createMultiSignatureTransaction } from '@api/transaction';
import { toRawLsk } from '@utils/lsk';
import TransactionInfo from '@shared/transactionInfo';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import ProgressBar from '../progressBar';
import styles from './styles.css';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;
const token = tokenMap.LSK.key;

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
    const [error, transaction] = await to(
      createMultiSignatureTransaction({
        network,
        mandatoryKeys,
        optionalKeys,
        numberOfSignatures,
        moduleAssetId,
        fee: toRawLsk(fee),
        nonce: account.sequence.nonce,
        passphrase: account.passphrase,
        senderPublicKey: account.summary.publicKey,
      }, token),
    );

    // eslint-disable-next-line max-len
    // if (transaction.signatures.filter(signature => signature.length > 0).length === numberOfSignatures) {

    // } else {
    //   nextStep({ transaction });
    // }
    // if (!error) {
    //   transactionCreatedSuccess(tx);
    // } else {
    //   transactionCreatedError(tx);
    //   nextStep({ transactionInfo: tx });
    // }
  };

  const goBack = () => {
    prevStep({ mandatoryKeys, optionalKeys, numberOfSignatures });
  };

  return (
    <section className={styles.wrapper}>
      <Box className={styles.container}>
        <div className={styles.header}>
          <h1>{t('Register multisignature account')}</h1>
        </div>
        <BoxContent className={styles.content}>
          <ProgressBar current={2} />
          <TransactionInfo
            t={t}
            fee={fee}
            account={account}
            members={members}
            moduleAssetId={moduleAssetId}
            numberOfSignatures={numberOfSignatures}
          />
        </BoxContent>
        <BoxFooter className={styles.footer} direction="horizontal">
          <SecondaryButton className="go-back" onClick={goBack}>{t('Edit')}</SecondaryButton>
          <PrimaryButton className="confirm" size="l" onClick={submitTransaction}>
            {t('Sign')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Summary;
