import React, { useEffect, useRef, useState } from 'react';
import liskClient from 'Utils/lisk-client'; // eslint-disable-line
import CopyToClipboard from 'react-copy-to-clipboard';
import styles from './signMessage.css';
import Box from '../../toolbox/box';
import BoxInfoText from '../../toolbox/box/infoText';
import BoxContent from '../../toolbox/box/content';
import BoxFooter from '../../toolbox/box/footer';
import BoxHeader from '../../toolbox/box/header';
import { AutoResizeTextarea } from '../../toolbox/inputs';
import { SecondaryButton, PrimaryButton } from '../../toolbox/buttons';
import { loginType } from '../../../constants/hwConstants';
import { signMessageByHW } from '../../../utils/hwManager';
import LoadingIcon from '../hwWalletLogin/loadingIcon';

const ConfirmationPending = ({ t, account }) => (
  <BoxContent className={styles.noPadding}>
    <BoxInfoText className={styles.pendingWrapper}>
      <span>
        {t('Please confirm the message on your {{model}}', { model: account.hwInfo.deviceModel })}
      </span>
      <LoadingIcon />
    </BoxInfoText>
  </BoxContent>
);

const Error = ({ t }) => (
  <BoxContent className={styles.noPadding}>
    <BoxInfoText>
      <span>
        {t('Message signature aborted on device')}
      </span>
    </BoxInfoText>
  </BoxContent>
);

const Result = ({
  t, signature, copied, copy, prevStep,
}) => (
  <>
    <BoxContent className={styles.noPadding}>
      <AutoResizeTextarea
        className={`${styles.result} result`}
        value={signature}
        readOnly
      />
    </BoxContent>
    <BoxFooter direction="horizontal">
      <SecondaryButton onClick={prevStep} className={styles.button}>
        {t('Go back')}
      </SecondaryButton>
      <CopyToClipboard
        onCopy={copy}
        text={signature}
      >
        <PrimaryButton disabled={copied} className={styles.button}>
          {copied ? t('Copied!') : t('Copy to clipboard')}
        </PrimaryButton>
      </CopyToClipboard>
    </BoxFooter>
  </>
);

const ConfirmMessage = ({
  apiVersion,
  prevStep,
  message,
  account,
  t,
}) => {
  const [copied, setCopied] = useState(false);
  const [signature, setSignature] = useState();
  const [error, setError] = useState();
  const ref = useRef();

  const copy = () => {
    setCopied(true);
    ref.current = setTimeout(() => setCopied(false), 3000);
  };

  const signUsingPassphrase = (Lisk) => {
    const signedMessage = Lisk.cryptography.signMessageWithPassphrase(
      message,
      account.passphrase,
      account.publicKey,
    );
    const result = Lisk.cryptography.printSignedMessage({
      message,
      publicKey: account.publicKey,
      signature: signedMessage.signature,
    });
    return result;
  };

  const signUsingHW = async (Lisk) => {
    const signedMessage = await signMessageByHW({
      account,
      message,
    });
    const result = Lisk.cryptography.printSignedMessage({
      message,
      publicKey: account.publicKey,
      signature: signedMessage,
    });
    return result;
  };

  useEffect(() => {
    const Lisk = liskClient(apiVersion);
    if (account.loginType === loginType.normal) {
      setSignature(signUsingPassphrase(Lisk));
    } else {
      signUsingHW(Lisk)
        .then(setSignature)
        .catch(setError);
    }
    return () => clearTimeout(ref.current);
  }, []);

  const confirmationPending = account.loginType !== loginType.normal && !error && !signature;

  return (
    <Box>
      <BoxHeader>
        <h1>{t('Sign a message')}</h1>
      </BoxHeader>
      {
        confirmationPending ? <ConfirmationPending t={t} account={account} /> : null
      }
      {
        error ? <Error t={t} /> : null
      }
      {
        !error && !confirmationPending
          ? (
            <Result
              t={t}
              signature={signature}
              copied={copied}
              copy={copy}
              prevStep={prevStep}
            />
          )
          : null
      }
    </Box>
  );
};

export default ConfirmMessage;
