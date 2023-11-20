import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import copyToClipboard from 'copy-to-clipboard';
import { useSession } from '@libs/wcm/hooks/useSession';
import Box from 'src/theme/box';
import Icon from 'src/theme/Icon';
import { TertiaryButton, PrimaryButton } from 'src/theme/buttons';
import Illustration from '@common/components/illustration';
import { joinModuleAndCommand, toTransactionJSON } from '@transaction/utils';
import moduleCommandSchemas from '@tests/constants/schemas';
import styles from './styles.css';

const errorData = (t) => ({
  error: true,
  illustration: 'transactionError',
  title: t('Transaction signature failure'),
  description: t(
    'There was an error signing your transaction. please close this dialog and try again.'
  ),
});

const successData = (t) => ({
  error: false,
  illustration: 'transactionSuccess',
  title: t('Transaction signature successful'),
  description: t(
    'Your transaction has been signed. Please copy the signed transaction and return to application.'
  ),
});

const getStringifiedTransactionJSON = (signedTransaction) => {
  const moduleCommand = joinModuleAndCommand(signedTransaction);
  const paramSchema = moduleCommandSchemas[moduleCommand];
  const transactionJSON = toTransactionJSON(signedTransaction, paramSchema);
  return JSON.stringify(transactionJSON);
};

// eslint-disable-next-line max-statements
const RequestSignStatus = (props) => {
  const { t } = useTranslation();
  const ref = useRef();
  const [copied, setCopied] = useState(false);
  const transactions = useSelector((state) => state.transactions);
  const { respond } = useSession();
  const stringifiedTransactionJSON = getStringifiedTransactionJSON(transactions.signedTransaction);

  const data =
    !transactions.txSignatureError && transactions.signedTransaction?.signatures?.length
      ? successData(t)
      : errorData(t);

  const onCopy = () => {
    setCopied(true);
    copyToClipboard(stringifiedTransactionJSON);
    ref.current = setTimeout(() => setCopied(false), 1000);
  };

  useEffect(() => () => clearTimeout(ref.current), []);

  useEffect(() => {
    respond({ payload: stringifiedTransactionJSON });
  }, []);

  return (
    <Box className={`${styles.wrapper} transaction-status`}>
      <Illustration name={data.illustration} className={styles.illustration} />
      <h5 className="result-box-header">{data.title}</h5>
      <p>{data.description}</p>
      {!data.error && (
        <PrimaryButton
          className={`${styles.signatureButton} copy-signature-button`}
          onClick={onCopy}
        >
          <span className={styles.buttonContent}>
            <Icon name="copy" />
            <span>{copied ? t('Copied') : t('Copy signature')}</span>
          </span>
        </PrimaryButton>
      )}
      <a
        href={props.formProps.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cancel}
      >
        <TertiaryButton>{t('Return to application')}</TertiaryButton>
      </a>
    </Box>
  );
};

export default RequestSignStatus;
