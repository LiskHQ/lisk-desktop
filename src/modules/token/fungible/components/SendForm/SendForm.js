import React, { useCallback, useMemo, useState } from 'react';
import Piwik from 'src/utils/piwik';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import AmountField from 'src/modules/common/components/amountField';
import { TokenField } from 'src/modules/common/components/TokenField';
import Icon from 'src/theme/Icon';
import { toRawLsk, fromRawLsk } from '@token/fungible/utils/lsk';
import BoxContent from 'src/theme/box/content';
import BoxHeader from 'src/theme/box/header';
import { maxMessageLength } from 'src/modules/transaction/configuration/transactions';
import {
  useCurrentApplication,
  useApplicationManagement,
} from 'src/modules/blockchainApplication/manage/hooks';
import { ApplicationField } from 'src/modules/common/components/ApplicationField';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import TxComposer from '@transaction/components/TxComposer';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import useAmountField from '../../hooks/useAmountField';
import useMessageField from '../../hooks/useMessageField';
import { useTransferableTokens } from '../../hooks';
import useRecipientField from '../../hooks/useRecipientField';
import styles from './form.css';
import MessageField from '../MessageField';

const getInitialData = (rawTx, initialValue) => rawTx?.params.data || initialValue || '';
const getInitialAmount = (rawTx, initialValue) =>
  Number(rawTx?.params.amount) ? fromRawLsk(rawTx?.params.amount) : initialValue || '';
const getInitialRecipient = (rawTx, initialValue) =>
  rawTx?.params.recipient.address || initialValue || '';
const getInitialRecipientChain = (
  transactionData,
  initialChainId,
  currentApplication,
  applications
) => {
  const initalRecipientChain = initialChainId
    ? applications.find(({ chainID }) => chainID === initialChainId)
    : null;

  return transactionData?.recipientChain || initalRecipientChain || currentApplication;
};
const getInitialToken = (
  transactionData,
  initalTokenId,
  tokens
) => {
  const initalToken = initalTokenId
    ? tokens.find(({ tokenID }) => tokenID === initalTokenId)
    : null;
  return transactionData?.token || initalToken || tokens[0];
};

// eslint-disable-next-line max-statements
const SendForm = (props) => {
  const { account = {}, prevState, t, bookmarks, nextStep } = props;
  const [currentApplication] = useCurrentApplication();
  const [sendingChain, setSendingChain] = useState(
    prevState?.transactionData?.sendingChain || currentApplication
  );
  const tokens = useTransferableTokens(sendingChain)
  const { applications } = useApplicationManagement();
  const [token, setToken] = useState(
    getInitialToken(prevState?.transactionData, props.initialValue?.token, tokens)
  );
  const [recipientChain, setRecipientChain] = useState(
    getInitialRecipientChain(
      prevState?.transactionData,
      props.initialValue?.recipientApplication,
      currentApplication,
      applications
    )
  );
  const { data: recipientApplication, isSuccess: isRecipientAppSuccess } = useBlockchainApplicationMeta();
  const [maxAmount, setMaxAmount] = useState({ value: 0, error: false });

  const [reference, setReference] = useMessageField(
    getInitialData(props.prevState?.rawTx, props.initialValue?.reference)
  );
  const [amount, setAmountField] = useAmountField(
    getInitialAmount(props.prevState?.rawTx, props.initialValue?.amount),
    account.summary?.balance,
    token?.symbol
  );
  const [recipient, setRecipientField] = useRecipientField(
    getInitialRecipient(props.prevState?.rawTx, props.initialValue?.recipient)
  );

  const onComposed = useCallback((status) => {
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    setMaxAmount(status.maxAmount);
  }, []);

  const onConfirm = useCallback((rawTx, selectedPriority, fees) => {
    nextStep({
      selectedPriority,
      rawTx,
      fees,
    });
  }, []);

  const handleRemoveMessage = useCallback(() => {
    setReference({ target: { value: '' } });
  }, []);

  const isValid = useMemo(
    () =>
      [amount, recipient, reference, recipientChain, sendingChain, token].reduce((result, item) => {
        result =
          result &&
          !item?.error &&
          (!item?.required || item?.value !== '') &&
          !Object.keys(result).length;

        return result;
      }, true),
    [amount, recipient, reference, recipientChain, sendingChain]
  );

  const transaction = {
    isValid,
    moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
    params: {
      amount: toRawLsk(amount.value),
      data: reference.value,
      recipient: {
        address: recipient.value,
        title: recipient.title,
      },
      token,
    },
    sendingChain,
    recipientChain,
  };
    console.log('tokens')
  return (
    <section className={styles.wrapper}>
      <TxComposer
        onComposed={onComposed}
        onConfirm={onConfirm}
        transaction={transaction}
        buttonTitle={t('Go to confirmation')}
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Send Tokens')}</h2>
          </BoxHeader>
          <BoxContent className={styles.formSection}>
            <div className={`${styles.ApplilcationFieldWrapper}`}>
              <ApplicationField
                styles={styles}
                label={t('From Application')}
                value={sendingChain}
                applications={isRecipientAppSuccess ? recipientApplication.data : []}
                onChange={setSendingChain}
              />
              <div>
                <Icon name="transferArrow" />
              </div>
              <ApplicationField
                styles={styles}
                label={t('To Application')}
                value={recipientChain}
                applications={isRecipientAppSuccess ? recipientApplication.data : []}
                onChange={setRecipientChain}
                isLoading
              />
            </div>
            <TokenField
              styles={styles}
              value={token}
              tokens={tokens}
              onChange={setToken}
            />
            <AmountField
              amount={amount}
              onChange={setAmountField}
              maxAmount={maxAmount}
              displayConverter
              label={t('Amount')}
              placeHolder={t('Insert transaction amount')}
              name="amount"
            />
            <div className={`${styles.fieldGroup} ${styles.recipientFieldWrapper}`}>
              <span className={`${styles.fieldLabel}`}>{t('Recipient Address')}</span>
              <BookmarkAutoSuggest
                bookmarks={bookmarks.LSK.filter((item) => !item.disabled)}
                recipient={recipient}
                t={t}
                updateField={setRecipientField}
              />
            </div>
            <MessageField
              name="reference"
              value={reference.value}
              onChange={setReference}
              label={t('Message (Optional)')}
              placeholder={t('Write message')}
              onRemove={handleRemoveMessage}
              maxMessageLength={maxMessageLength}
              error={reference.error}
              feedback={reference.feedback}
            />
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};

export default SendForm;
