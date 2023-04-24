import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import copyToClipboard from 'copy-to-clipboard';
import { useSession } from '@libs/wcm/hooks/useSession';
import Box from 'src/theme/box';
import Icon from 'src/theme/Icon';
import { TertiaryButton, PrimaryButton } from 'src/theme/buttons';
import Illustration from '@common/components/illustration';
import styles from './styles.css';

const errorData = (t) => ({
  error: true,
  illustration: 'transactionError',
  title: t('Transaction signing failed'),
  description: t('There was an error signing your transaction. please close this dialog and try again.'),
});

const successData = (t) => ({
  error: false,
  illustration: 'transactionSuccess',
  title: t('Transaction signing successful'),
  description: t('Your transaction has been signed, click the button below to copy your signed transaction, once copied you will be redirected to application.'),
});

const RequestSignStatus = () => {
  const { t } = useTranslation();
  const ref = useRef();
  const [copied, setCopied] = useState(false);
  const transactions = useSelector(state => state.transactions);
  const { respond, reject } = useSession();

  const data = !transactions.txSignatureError && transactions.signedTransaction?.signatures?.length
    ? successData(t) : errorData(t);

  const onCopy = () => {
    setCopied(true);
    const signatures = transactions.signedTransaction?.signatures.map((sig) => sig.toString('hex'));
    const payload = JSON.stringify(signatures);
    copyToClipboard(payload);
    // inform to the application
    respond({ payload });
    ref.current = setTimeout(() => setCopied(false), 1000);
  };

  useEffect(() => () => clearTimeout(ref.current), []);

  return (
    <Box className={`${styles.wrapper} transaction-status`}>
      <Illustration name={data.illustration} className={styles.illustration} />
      <h5 className="result-box-header">{data.title}</h5>
      <p>
        {data.description}
      </p>
      {
        !data.error && (
          <PrimaryButton
            className={`${styles.signatureButton} copy-signature-button`}
            onClick={onCopy}
          >
            <span className={styles.buttonContent}>
              <Icon name="copy" />
              <span>
                {copied ? 'Copied' : 'Copy and return to application'}
              </span>
            </span>
          </PrimaryButton>
        )
      }
      <TertiaryButton
        className={styles.cancel}
        onClick={reject}
      >
        {t('Cancel')}
      </TertiaryButton>
    </Box>
  );
};

export default RequestSignStatus;
