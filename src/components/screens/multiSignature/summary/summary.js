import React from 'react';
import { signTransactionByHW } from '@utils/hwManager';
import { MODULE_ASSETS_NAME_ID_MAP, loginTypes, tokenMap } from '@constants';
import to from 'await-to-js';
import { create, computeTransactionId } from '@api/transaction';
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
}) => {
  const signTransaction = async () => {
    const isHwSigning = account.loginType !== loginTypes.passphrase.code;
    let [error, transaction] = await to(
      create({
        network,
        account,
        transactionObject: {
          mandatoryKeys,
          optionalKeys,
          numberOfSignatures,
          moduleAssetId,
          fee: toRawLsk(fee),
          nonce: account.sequence.nonce,
          senderPublicKey: account.summary.publicKey,
        },
        isHwSigning,
      }, token),
    );

    if (error) {
      nextStep({ error });
    }

    if (isHwSigning) {
      // transaction contain transactionObject and transactionBytes that needs to be signed by HW
      [error, transaction] = await to(signTransactionByHW(
        account,
        transaction.networkIdentifier,
        transaction.transactionObject,
        transaction.transactionBytes,
      ));
      transaction.id = computeTransactionId({ transaction });
    }

    if (error) {
      nextStep({ error });
    } else {
      nextStep({ transaction });
    }
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
          <PrimaryButton className="confirm" size="l" onClick={signTransaction}>
            {t('Sign')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Summary;
