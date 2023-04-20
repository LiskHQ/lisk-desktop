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
  const [
    {
      metadata: { pubkey },
    },
  ] = useCurrentAccount();

  const onMultiStepChange = useCallback(({ step: { current } }) => {
    setMultiStepPosition(current);
  }, []);

  return (
    <Dialog hasClose className={styles.wrapper} size={multiStepPosition === 1 && 'sm'}>
      <Box>
        {multiStepPosition !== 1 && (
          <BoxHeader className={styles.header}>
            <h1>{multiStepPosition === 2 ? t('Signed message') : t('Sign message')}</h1>
          </BoxHeader>
        )}
        <MultiStep onChange={onMultiStepChange}>
          <MessageForm history={history} signMessage={signMessage} />
          <TxSignatureCollector transactionJSON={{ senderPublicKey: pubkey, params: {} }} />
          <SignedMessage history={history} account={account} />
        </MultiStep>
      </Box>
    </Dialog>
  );
};

export default signMessageView;
