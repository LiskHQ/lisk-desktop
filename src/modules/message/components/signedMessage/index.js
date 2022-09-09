import React, { useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import Illustration from 'src/modules/common/components/illustration';
import { getDeviceType } from '@wallet/utils/hwManager';
import { AutoResizeTextarea } from 'src/theme';
import { SecondaryButton, PrimaryButton } from 'src/theme/buttons';
import styles from './signedMessage.css';

const Error = ({ t, hwInfo }) => {
  const deviceType = getDeviceType(hwInfo?.deviceModel);

  return (
    <BoxContent className={`${styles.noPadding} ${styles.statusWrapper}`}>
      <Illustration name={`${deviceType}HwRejection`} />
      <h5>{t('Transaction aborted on device')}</h5>
      <p>{t('You have cancelled the transaction on your hardware wallet.')}</p>
    </BoxContent>
  );
};

const Success = ({ t, signature, copied, copy, prevStep, onPrev }) => (
  <>
    <BoxContent className={styles.noPadding}>
      <AutoResizeTextarea className={`${styles.result} result`} value={signature} readOnly />
    </BoxContent>
    <BoxFooter direction="horizontal">
      <SecondaryButton
        onClick={() => {
          onPrev?.();
          prevStep();
        }}
        className={`${styles.button} go-back`}
      >
        {t('Go back')}
      </SecondaryButton>
      <CopyToClipboard onCopy={copy} text={signature}>
        <PrimaryButton disabled={copied} className={`${styles.button} copy-to-clipboard`}>
          {copied ? t('Copied!') : t('Copy to clipboard')}
        </PrimaryButton>
      </CopyToClipboard>
    </BoxFooter>
  </>
);

const SignedMessage = ({ t, prevStep, signature, error, account, onPrev }) => {
  const [copied, setCopied] = useState(false);
  const ref = useRef();

  const copy = () => {
    setCopied(true);
    ref.current = setTimeout(() => setCopied(false), 3000);
  };

  useEffect(() => () => clearTimeout(ref.current), []);

  if (error) {
    return <Error t={t} hwInfo={account.hwInfo} />;
  }
  return (
    <Success
      t={t}
      signature={signature}
      copied={copied}
      copy={copy}
      prevStep={prevStep}
      onPrev={onPrev}
    />
  );
};

export default SignedMessage;
