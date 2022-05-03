import React, { useState } from 'react';
import { maxMessageLength } from '@transaction/configuration/transactions';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { toRawLsk } from '@token/fungible/utils/lsk';
import TransactionPriority from '@transaction/components/TransactionPriority';
import useTransactionFeeCalculation from '@transaction/hooks/useTransactionFeeCalculation';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import { AutoResizeTextarea } from 'src/theme';
import CircularProgress from 'src/theme/ProgressCircular/circularProgress';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import FormBase from './formBase';
import styles from './form.css';
import useAmountField from './useAmountField';
import useMessageField from './useMessageField';
import useRecipientField from './useRecipientField';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.transfer;

// eslint-disable-next-line max-statements
const FormLsk = (props) => {
  const {
    t, token, getInitialValue, account, network,
  } = props;
  const [customFee, setCustomFee] = useState();
  const [
    selectedPriority, selectTransactionPriority,
    priorityOptions, prioritiesLoadError, loadingPriorities,
  ] = useTransactionPriority(token);
  const [reference, onReferenceChange] = useMessageField(getInitialValue('reference'));
  const [amount, setAmountField] = useAmountField(getInitialValue('amount'), account.summary?.balance ?? 0, token);
  const [recipient, setRecipientField] = useRecipientField(getInitialValue('recipient'));

  const { fee, maxAmount, minFee } = useTransactionFeeCalculation({
    network,
    selectedPriority,
    token,
    wallet: account,
    priorityOptions,
    transaction: {
      moduleAssetId,
      amount: toRawLsk(amount.value),
      recipientAddress: recipient.value,
      nonce: account.sequence?.nonce,
      senderPublicKey: account.summary?.publicKey,
      data: reference.value,
    },
  });

  const fieldUpdateFunctions = { setAmountField, setRecipientField };
  const fields = {
    amount,
    recipient,
    reference,
    fee: customFee || fee,
    selectedPriority,
  };

  const changeCustomFee = (value) => {
    setCustomFee(value);
  };

  return (
    <FormBase
      {...props}
      fields={fields}
      fieldUpdateFunctions={fieldUpdateFunctions}
      maxAmount={maxAmount}
    >
      <label className={`${styles.fieldGroup} reference`}>
        <span className={`${styles.fieldLabel}`}>{t('Message (optional)')}</span>
        <span className={styles.referenceField}>
          <AutoResizeTextarea
            maxLength={100}
            spellCheck={false}
            onChange={onReferenceChange}
            name="reference"
            value={reference.value}
            placeholder={t('Write message')}
            className={`${styles.textarea} ${reference.error ? 'error' : ''} message`}
          />
          <CircularProgress
            max={maxMessageLength}
            value={reference.byteCount}
            className={`${styles.byteCounter} ${reference.error ? styles.hide : ''}`}
          />
          <Icon
            className={`${styles.status} ${styles.referenceStatus} ${!reference.value ? styles.hide : styles.show}`}
            name={reference.error ? 'alertIcon' : 'okIcon'}
          />
        </span>
        <span className={`${styles.feedback} ${reference.error || maxMessageLength - reference.byteCount < 10 ? 'error' : ''} ${styles.show}`}>
          {reference.feedback}
          <Tooltip
            position="left"
            title={t('Bytes counter')}
          >
            <p className={styles.tooltipText}>
              {
                t(`Lisk counts your message in bytes, so keep in mind
                that the length of your message may vary in different languages.
                Different characters may consume a varying amount of bytes.`)
              }
            </p>
          </Tooltip>
        </span>
      </label>
      <TransactionPriority
        token={token}
        fee={fee}
        minFee={Number(minFee.value)}
        customFee={customFee ? customFee.value : undefined}
        moduleAssetId={moduleAssetId}
        setCustomFee={changeCustomFee}
        priorityOptions={priorityOptions}
        selectedPriority={selectedPriority.selectedIndex}
        setSelectedPriority={selectTransactionPriority}
        loadError={prioritiesLoadError}
        isLoading={loadingPriorities}
      />
    </FormBase>
  );
};

export default FormLsk;
