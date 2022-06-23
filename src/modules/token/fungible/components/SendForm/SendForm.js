import React, { useState } from 'react';
import Piwik from 'src/utils/piwik';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import AmountField from 'src/modules/common/components/amountField';
import { toRawLsk, fromRawLsk } from '@token/fungible/utils/lsk';
import BoxContent from 'src/theme/box/content';
import BoxHeader from 'src/theme/box/header';
import TxComposer from '@transaction/components/TxComposer';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import useAmountField from './useAmountField';
import useMessageField from './useMessageField';
import useRecipientField from './useRecipientField';
import styles from './form.css';
import MessageField from './MessageField';

const getInitialData = (rawTx, initialValue) => rawTx?.asset.data || initialValue || '';
const getInitialAmount = (rawTx, initialValue) => (Number(rawTx?.asset.amount) ? fromRawLsk(rawTx?.asset.amount) : initialValue || '');
const getInitialRecipient = (rawTx, initialValue) => rawTx?.asset.recipient.address || initialValue || '';

const SendForm = (props) => {
  const {
    t,
    token,
    account,
    bookmarks,
    nextStep,
  } = props;
  const [reference, setReference] = useMessageField(
    getInitialData(props.prevState?.rawTx, props.initialValue.reference),
  );
  const [amount, setAmountField] = useAmountField(
    getInitialAmount(
      props.prevState?.rawTx,
      props.initialValue.amount,
    ),
    account.summary?.balance,
    token,
  );
  const [recipient, setRecipientField] = useRecipientField(
    getInitialRecipient(props.prevState?.rawTx, props.initialValue.recipient),
  );
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
      recipient: {
        address: recipient.value,
        title: recipient.title,
      },
      amount: toRawLsk(amount.value),
      data: reference.value,
    },
  };

  return (
    <section className={styles.wrapper}>
      <TxComposer
        onComposed={onComposed}
        onConfirm={onConfirm}
        transaction={transaction}
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Send {{token}}', { token })}</h2>
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
    </section>
  );
};

export default SendForm;
