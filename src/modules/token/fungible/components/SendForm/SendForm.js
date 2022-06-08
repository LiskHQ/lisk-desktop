import React, { useState } from 'react';
import Piwik from 'src/utils/piwik';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import AmountField from 'src/modules/common/components/amountField';
import { toRawLsk } from '@token/fungible/utils/lsk';
import BoxContent from 'src/theme/box/content';
import BoxHeader from 'src/theme/box/header';
import TxComposer from '@transaction/components/TxComposer';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import useAmountField from './useAmountField';
import useMessageField from './useMessageField';
import useRecipientField from './useRecipientField';
import styles from './form.css';
import MessageField from './MessageField';

const getInitialValue = (fieldName, props) => (
  props.prevState && props.prevState.fields ? props.prevState.fields[fieldName].value : props.initialValue[fieldName] || ''
);

const SendForm = (props) => {
  const {
    t,
    token,
    account,
    bookmarks,
    nextStep,
  } = props;
  const [reference, setReference] = useMessageField(getInitialValue('reference', props));
  const [amount, setAmountField] = useAmountField(getInitialValue('amount', props), account.summary?.balance ?? 0, token);
  const [recipient, setRecipientField] = useRecipientField(getInitialValue('recipient', props));
  const [maxAmount, setMaxAmount] = useState({ value: 0, error: false });

  const onComposed = (status) => {
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    setMaxAmount(status.maxAmount);
  };

  const onConfirm = (rawTx) => {
    nextStep({ rawTx });
  };

  const isValid = [amount, recipient, reference].reduce((result, item) => {
    result = result && !item.error && (!item.required || item.value !== '');
    return result;
  }, true);

  const transaction = {
    isValid,
    moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.transfer,
    asset: {
      recipientAddress: recipient.value,
      amount: toRawLsk(amount.value),
      data: reference.value,
    },
  };

  return (
    <TxComposer
      className={styles.wrapper}
      onComposed={onComposed}
      onConfirm={onConfirm}
      transaction={transaction}
    >
      <>
        <BoxHeader>
          <h1>{t('Send {{token}}', { token })}</h1>
        </BoxHeader>
        <BoxContent className={styles.formSection}>
          <span className={`${styles.fieldGroup} recipient`}>
            <span className={`${styles.fieldLabel}`}>{t('Recipient')}</span>
            <BookmarkAutoSuggest
              bookmarks={bookmarks[token].filter((item) => !item.disabled)}
              recipient={recipient}
              t={t}
              updateField={setRecipientField}
            />
          </span>
          <AmountField
            amount={amount}
            onChange={setAmountField}
            maxAmount={maxAmount}
            displayConverter
            label={t('Amount')}
            placeHolder={t('Insert transaction amount')}
            useMaxLabel={t('Send maximum amount')}
            name="amount"
          />
          <MessageField
            t={t}
            reference={reference}
            setReference={setReference}
          />
        </BoxContent>
      </>
    </TxComposer>
  );
};

export default SendForm;
