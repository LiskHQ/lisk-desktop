import React, { useCallback, useState } from 'react';
import { useCurrentAccount } from '@account/hooks';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import Dialog from 'src/theme/dialog/dialog';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import MessageForm from '../messageForm';
import SignedMessage from '../signedMessage';
import styles from './signMessageView.css';

const signMessageView = ({ account, t, history, signMessage }) => {
  const [multiStepPosition, setMultiStepPosition] = useState(0);
  const [isErrorView, setIsErrorView] = useState(false);
  const [
    {
      metadata: { pubkey },
    },
  ] = useCurrentAccount();

  const onMultiStepChange = useCallback((multistepState) => {
    setIsErrorView(false);
    const { step: { current, data } = {} } = multistepState || {};
    const statusState = data?.[2];
    const hasError = !!statusState?.error;

    if (hasError) {
      setIsErrorView(hasError);
    }
    setMultiStepPosition(current);
  }, []);

  return (
    <Dialog hasClose className={styles.wrapper} size={multiStepPosition > 0 && 'sm'}>
      <Box>
        {multiStepPosition !== 1 && !isErrorView && (
          <BoxHeader className={styles.header}>
            <h1>{multiStepPosition === 2 ? t('Signed message') : t('Sign message')}</h1>
          </BoxHeader>
        )}
        <MultiStep onChange={onMultiStepChange}>
          <MessageForm history={history} signMessage={signMessage} />
          <TxSignatureCollector
            type="message"
            transactionJSON={{ senderPublicKey: pubkey, params: {} }}
          />
          <SignedMessage history={history} account={account} />
        </MultiStep>
      </Box>
    </Dialog>
  );
};

export default signMessageView;
