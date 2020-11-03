import React from 'react';
import Lisk from '@liskhq/lisk-client';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import MultiSignatureReview from '../../../shared/multiSignatureReview';
import { extractAddress } from '../../../../utils/account';
import ProgressBar from '../progressBar';
import styles from '../styles.css';

const convertKeyToMemberData = accountRole => publicKey => ({
  accountId: extractAddress(publicKey),
  publicKey,
  accountRole,
});

const ReviewSign = ({
  t,
  transaction,
  networkIdentifier,
  host,
  prevStep,
  nextStep,
}) => {
  const mandatoryMembers = transaction.asset.mandatoryKeys.map(convertKeyToMemberData('mandatory'));
  const optionalMembers = transaction.asset.optionalKeys.map(convertKeyToMemberData('optional'));
  const members = [...mandatoryMembers, ...optionalMembers];
  const fee = parseInt(transaction.fee, 10);
  const requiredSignatures = transaction.asset.numberOfSignatures;

  const submitTransaction = () => {
    try {
      const signedTx = Lisk.transactions.signMultiSignatureTransaction({
        transaction,
        passphrase: host.passphrase,
        networkIdentifier,
        keys: {
          mandatoryKeys: transaction.asset.mandatoryKeys,
          optionalKeys: transaction.asset.optionalKeys,
        },
      });
      nextStep({ transactionInfo: signedTx });
    } catch (error) {
      nextStep({ error });
    }
  };

  return (
    <section>
      <Box className={styles.boxContainer}>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>{t('If you have received a multisignature transaction that requires your signature, use this tool to review and sign it.')}</p>
        </header>
        <BoxContent>
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

export default ReviewSign;
