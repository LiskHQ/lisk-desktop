import React, { useState } from 'react';

import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import Dialog from '@basics/dialog/dialog';
import MessageForm from '../messageForm';
import SignedMessage from '../signedMessage';
import SignatureCollector from '../signatureCollector';
import styles from './signMessageView.css';

const signMessageView = ({
  account, t, history,
}) => {
  const [isNext, setIsNext] = useState(true);

  return (
    <Dialog hasClose className={styles.wrapper}>
      <Box>
        <BoxHeader>
          <h1>{t('Sign message')}</h1>
        </BoxHeader>
        <MultiStep>
          <MessageForm
            t={t}
            history={history}
            onNext={() => setIsNext(true)}
          />
          <SignatureCollector
            t={t}
            isNext={isNext}
            account={account}
          />
          <SignedMessage
            t={t}
            history={history}
            account={account}
            onPrev={() => setIsNext(false)}
          />
        </MultiStep>
      </Box>
    </Dialog>
  );
};

export default signMessageView;
