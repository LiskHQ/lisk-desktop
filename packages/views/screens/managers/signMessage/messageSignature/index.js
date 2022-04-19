import React, { useEffect, useState } from 'react';
import { cryptography } from '@liskhq/lisk-client'; // eslint-disable-line

import loginTypes from '@wallet/configuration/loginTypes';
import { signMessageByHW, getDeviceType } from '@wallet/utilities/hwManager';
import Illustration from '@basics/illustration';
import BoxContent from '@basics/box/content';
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
      wallet: account,
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
    } else if (prevStep) {
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
