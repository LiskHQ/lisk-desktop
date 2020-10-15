import React, { useState } from 'react';

import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import TransactionPriority from '../../../shared/transactionPriority';
import { tokenMap } from '../../../../constants/tokens';
import useTransactionFeeCalculation from '../../send/form/useTransactionFeeCalculation';
import useTransactionPriority from '../../send/form/useTransactionPriority';

import styles from './styles.css';
import { PrimaryButton } from '../../../toolbox/buttons';

const token = tokenMap.LSK.key;
const txType = 'createMultiSig';

const Editor = ({
  t, account, nextStep,
}) => {
  const [customFee, setCustomFee] = useState();
  const [
    selectedPriority, selectTransactionPriority, priorityOptions,
  ] = useTransactionPriority(token);

  const { fee, minFee } = useTransactionFeeCalculation({
    selectedPriority,
    token,
    account,
    priorityOptions,
    txData: {
      txType,
      nonce: account.nonce,
      senderPublicKey: account.publicKey,
      signatures: [], // no of signatures needed?
      // @todo create proper multi-sig tx
    },
  });

  //   const feedback = validateVotes(votes, account.balance, fee.value, t);
  const feedback = { error: false };
  const isCTADisabled = false;

  const goToNextStep = () => {
    const feeValue = customFee ? customFee.value : fee.value;
    nextStep({ fee: feeValue });
  };

  return (
    <section className={styles.wrapper}>
      <Box>

        <BoxContent className={styles.contentContainer}>
          <div className={styles.contentScrollable}>
            {/* put input fields here */}
          </div>
        </BoxContent>
        <TransactionPriority
          className={styles.txPriority}
          token={token}
          fee={fee}
          minFee={minFee.value}
          customFee={customFee ? customFee.value : undefined}
          txType={txType}
          setCustomFee={setCustomFee}
          priorityOptions={priorityOptions}
          selectedPriority={selectedPriority.selectedIndex}
          setSelectedPriority={selectTransactionPriority}
        />
        {
          feedback.error && <span className="feedback">{feedback.messages[0]}</span>
        }
        <BoxFooter>
          <PrimaryButton
            size="l"
            disabled={isCTADisabled}
            onClick={goToNextStep}
          >
            {t('Go to Confirmation')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Editor;
