import React, { useEffect, useRef } from 'react';
import { checkIfInsideLiskApp } from '@wallet/utils/hwManager';
import { TertiaryButton } from 'src/theme/buttons';
import Illustration from 'src/modules/common/components/illustration';
import Spinner from 'src/theme/Spinner';
import styles from './hwWalletLogin.css';

const UnlockDevice = ({
  deviceId, devices, prevStep, nextStep, goBack, t,
}) => {
  const timeOut = useRef();
  const selected = devices.find((d) => d.deviceId === deviceId) || {};

  const checkIfAppRunning = async () => {
    await checkIfInsideLiskApp({ id: deviceId });
  };

  const navigateIfNeeded = () => {
    clearTimeout(timeOut.current);
    if (!selected.model) {
      prevStep({ reset: true });
    } else if (selected.openApp) {
      nextStep({ device: selected });
    } else {
      timeOut.current = setTimeout(checkIfAppRunning, 1000);
    }
  };

  useEffect(() => () => clearTimeout(timeOut.current), []);

  useEffect(() => {
    navigateIfNeeded();
  }, [devices]);

  return selected.model ? (
    <div>
      <h1>
        {t('{{deviceModel}} connected! Open the Lisk app on the device', {
          deviceModel: selected.model,
        })}
      </h1>
      <p>
        {t('If you’re not sure how to do this please follow the')}
        {' '}
      </p>
      <div className={styles.illustration}>
        <Illustration name="ledgerNano" />
      </div>
      <TertiaryButton onClick={goBack}>{t('Go back')}</TertiaryButton>
    </div>
  ) : (
    <div>
      <Spinner label="Checking devices" completed={false} />
    </div>
  );
};

export default UnlockDevice;
