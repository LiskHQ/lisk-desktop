import React, { useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import Illustration from 'src/modules/common/components/illustration';
import { AutoResizeTextarea } from 'src/theme';
import { SecondaryButton, PrimaryButton } from 'src/theme/buttons';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import styles from './signedMessage.css';

const Error = ({ t }) => (
  <BoxContent className={styles.statusWrapper}>
    <Illustration name="ledgerNanoHwRejection" />
    <h5>{t('Transaction aborted on device')}</h5>
    <p className={styles.errorInfoText}>
      {t('You have cancelled the transaction on your hardware wallet.')}
    </p>
  </BoxContent>
);

const Success = ({ t, signature, copied, copy, history, onPrev }) => (
  <>
    <BoxContent>
      <AutoResizeTextarea className={`${styles.result} result`} value={signature} readOnly />
    </BoxContent>
    <BoxFooter direction="horizontal">
      <SecondaryButton
        onClick={() => {
          onPrev?.();
          removeSearchParamsFromUrl(history, ['modal'], true);
        }}
        className={`${styles.button} close`}
      >
        {t('Close')}
      </SecondaryButton>
      <CopyToClipboard onCopy={copy} text={signature}>
        <PrimaryButton disabled={copied} className={`${styles.button} copy-to-clipboard`}>
          {copied ? t('Copied!') : t('Copy to clipboard')}
        </PrimaryButton>
      </CopyToClipboard>
    </BoxFooter>
  </>
);

const SignedMessage = ({ history, signature, error, account, onPrev }) => {
  const { t } = useTranslation();
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
      history={history}
      onPrev={onPrev}
    />
  );
};

export default withRouter(SignedMessage);
