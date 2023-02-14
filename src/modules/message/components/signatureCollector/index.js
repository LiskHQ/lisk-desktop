import React, { useEffect, useState } from 'react';

import loginTypes from '@auth/const/loginTypes';
import { getDeviceType } from '@wallet/utils/hwManager';
import Illustration from 'src/modules/common/components/illustration';
import BoxContent from 'src/theme/box/content';
import { signUsingPrivateKey, signUsingHW } from '@wallet/utils/signMessage';
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
        signUsingHW({ message, account }).then(setSignature).catch(setError);
      }
    } else if (isNext) {
      nextStep({ signature, error, message });
    } else if (prevStep) {
      prevStep();
    }
  }, [signature, error]);

  if (!deviceType) {
    return <div />;
  }

  return (
    <BoxContent className={styles.pendingWrapper}>
      <Illustration name={deviceType} />
      <h5>
        {t('Please confirm the message on your {{deviceModel}}', {
          deviceModel: account.hwInfo.deviceModel,
        })}
      </h5>
    </BoxContent>
  );
};

export default SignatureCollector;
