import React, { useEffect, useState } from 'react';
import { cryptography } from '@liskhq/lisk-client'; // eslint-disable-line

import { loginTypes } from '@constants';
import { signMessageByHW, getDeviceType } from '@utils/hwManager';
import Illustration from '@toolbox/illustration';
import BoxContent from '@toolbox/box/content';
import styles from '../signMessage.css';

const MessageSignature = ({
  nextStep,
  message,
  account,
  t,
  isNext,
  prevStep,
}) => {
  const [signature, setSignature] = useState();
  const [error, setError] = useState();
  const deviceType = getDeviceType(account.hwInfo?.deviceModel);

  const signUsingPrivateKey = () => {
    const msgBytes = cryptography.digestMessage(message);
    const signedMessage = cryptography.signDataWithPrivateKey(msgBytes, Buffer.from(account.summary.privateKey, 'hex'));
    const result = cryptography.printSignedMessage({
      message,
      publicKey: account.summary.publicKey,
      signature: signedMessage,
    });
    return result;
  };

  const signUsingHW = async () => {
    let signedMessage = await signMessageByHW({
      account,
      message,
    });
    if (signedMessage instanceof Uint8Array) {
      signedMessage = Buffer.from(signedMessage);
    }
    const result = cryptography.printSignedMessage({
      message,
      publicKey: account.summary.publicKey,
      signature: signedMessage,
    });
    return result;
  };

  useEffect(() => {
    if (!signature && !error) {
      if (account.loginType === loginTypes.passphrase.code) {
        setSignature(signUsingPrivateKey());
      } else {
        signUsingHW()
          .then(setSignature)
          .catch(setError);
      }
    } else if (isNext) {
      nextStep({ signature, error, message });
    } else {
      prevStep();
    }
  }, [signature, error]);

  if (!deviceType) {
    return (<div />);
  }

  return (
    <BoxContent className={styles.pendingWrapper}>
      <Illustration name={deviceType} />
      <h5>
        {t('Please confirm the message on your {{deviceModel}}', { deviceModel: account.hwInfo.deviceModel })}
      </h5>
    </BoxContent>
  );
};

export default MessageSignature;
