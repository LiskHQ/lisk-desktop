import React, { useState } from 'react';

import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import MultiStep from '@shared/multiStep';
import Dialog from '@basics/dialog/dialog';
import Form from './form';
import Status from './status';
import MessageSignature from './messageSignature';
import styles from './signMessage.css';

const SignMessage = ({
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
          <Form t={t} history={history} onNext={() => setIsNext(true)} />
          <MessageSignature isNext={isNext} t={t} account={account} />
          <Status t={t} history={history} account={account} onPrev={() => setIsNext(false)} />
        </MultiStep>
      </Box>
    </Dialog>
  );
};

export default SignMessage;
