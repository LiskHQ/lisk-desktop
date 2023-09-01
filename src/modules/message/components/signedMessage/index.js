import React, { useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import Illustration from 'src/modules/common/components/illustration';
import { AutoResizeTextarea } from 'src/theme';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import { statusMessages } from '@transaction/configuration/statusConfig';
import getIllustration from '@transaction/components/TxBroadcaster/illustrationsMap';
import Icon from '@theme/Icon';
import styles from './signedMessage.css';

const Error = ({ t, error, reset }) => {
  const status = statusMessages(t)[error.hwTxStatusType];
  const illustrationName = getIllustration(error.hwTxStatusType, 'default');

  return (
    <BoxContent className={styles.statusWrapper}>
      <Icon name="arrowLeftTailed" className={styles.backBtn} onClick={reset} />
      <Illustration className={styles.illustration} name={illustrationName || 'hwRejection'} />
      <h3>{status.title || t('Transaction aborted on device')}</h3>
      <p className={styles.errorInfoText}>
        {status.message || t('You have cancelled the transaction on your hardware wallet.')}
      </p>
    </BoxContent>
  );
};

const Success = ({ t, signature, copied, copy, onPrev }) => {
  const history = useHistory();
  return (
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
};

const SignedMessage = ({ signature, error, onPrev, reset }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const ref = useRef();

  const copy = () => {
    setCopied(true);
    ref.current = setTimeout(() => setCopied(false), 3000);
  };

  useEffect(() => () => clearTimeout(ref.current), []);

  if (error) {
    return <Error t={t} error={error} reset={reset} />;
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

export default SignedMessage;
