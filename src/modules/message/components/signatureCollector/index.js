import React, { useEffect, useState } from 'react';
import { cryptography } from '@liskhq/lisk-client'; // eslint-disable-line

import loginTypes from '@wallet/configuration/loginTypes';
import { getDeviceType } from '@wallet/utilities/hwManager';
import Illustration from '@basics/illustration';
import BoxContent from '@basics/box/content';
import { signUsingPrivateKey, signUsingHW } from '@wallet/manager/signMessage';
import styles from './signatureCollector.css';

const SignatureCollector = ({
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

  useEffect(() => {
    if (!signature && !error) {
      if (account.loginType === loginTypes.passphrase.code) {
        setSignature(signUsingPrivateKey({ message, account }));
      } else {
        signUsingHW({ message, account })
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

export default SignatureCollector;
