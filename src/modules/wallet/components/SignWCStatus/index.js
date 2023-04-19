import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import copyToClipboard from 'copy-to-clipboard';
import { useSession } from '@libs/wcm/hooks/useSession';
import Box from 'src/theme/box';
import Icon from 'src/theme/Icon';
import { TertiaryButton, PrimaryButton } from 'src/theme/buttons';
import Illustration from '@common/components/illustration';
import styles from './signWCStatus.css';

const SignWCStatus = () => {
  const { t } = useTranslation();
  const ref = useRef();
  const [copied, setCopied] = useState(false);
  const transactions = useSelector(state => state.transactions);
  const { respond } = useSession();

  const onCopy = () => {
    setCopied(true);
    const signatures = transactions.signedTransaction?.signatures.map((sig) => sig.toString('hex'));
    const payload = JSON.stringify(signatures);
    copyToClipboard(payload);
    // return to the application
    respond({ payload });
    ref.current = setTimeout(() => setCopied(false), 1000);
  };

  useEffect(() => () => clearTimeout(ref.current), []);

  return (
    <Box className={`${styles.wrapper} transaction-status`}>
      <Illustration name="transactionSuccess" />
      <h5 className="result-box-header">{t('Transaction signing successful')}</h5>
      <p>
        {t('Your transaction has been signed, click the button below to copy your signed transaction, once copied you will be redirected to application.')}
      </p>
      <PrimaryButton
        className={`${styles.signatureButton} copy-signature-button`}
        onClick={onCopy}
      >
        <span className={styles.buttonContent}>
          <Icon name={copied ? 'checkmark' : 'copy'} />
          <span>{t('Copy and return to application')}</span>
        </span>
      </PrimaryButton>
      
      <TertiaryButton className={styles.cancel}>{t('Cancel')}</TertiaryButton>
    </Box>
  );
};

export default SignWCStatus;
