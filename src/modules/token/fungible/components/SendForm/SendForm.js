import React, { useCallback, useMemo, useState } from 'react';
import Piwik from 'src/utils/piwik';
import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import AmountField from 'src/modules/common/components/amountField';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { mockAppTokens } from '@tests/fixtures/token';
import Icon from 'src/theme/Icon';
import { toRawLsk, fromRawLsk } from '@token/fungible/utils/lsk';
import BoxContent from 'src/theme/box/content';
import BoxHeader from 'src/theme/box/header';
import { maxMessageLength } from 'src/modules/transaction/configuration/transactions';
import { useCurrentApplication } from 'src/modules/blockchainApplication/manage/hooks/useCurrentApplication';
import useApplicationManagement from 'src/modules/blockchainApplication/manage/hooks/useApplicationManagement';
import MenuSelect, { MenuItem } from 'src/modules/wallet/components/MenuSelect';
import TxComposer from '@transaction/components/TxComposer';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import useAmountField from '../../hooks/useAmountField';
import { useMessageField } from '../../hooks';
import useRecipientField from '../../hooks/useRecipientField';
import styles from './form.css';
import MessageField from '../MessageField';
import chainLogo from '../../../../../../setup/react/assets/images/LISK.png';

const defaultToken = mockAppTokens[0];
const getInitialData = (rawTx, initialValue) => rawTx?.asset.data || initialValue || '';
const getInitialAmount = (rawTx, initialValue) => (Number(rawTx?.asset.amount) ? fromRawLsk(rawTx?.asset.amount) : initialValue || '');
const getInitialRecipient = (rawTx, initialValue) => rawTx?.asset.recipient.address || initialValue || '';

// eslint-disable-next-line max-statements
const SendForm = (props) => {
  const {
    account = {},
    prevState,
    t,
    bookmarks,
    nextStep,
  } = props;

  const [currentApplication] = useCurrentApplication();
  const { applications } = useApplicationManagement();

  const [token, setToken] = useState(
    prevState?.transactionData?.token || defaultToken,
  );
  const [recipientChain, setRecipientChain] = useState(
    prevState?.transactionData?.recipientChain || currentApplication,
  );
  const [sendingChain, setSendingChain] = useState(
    prevState?.transactionData?.sendingChain || currentApplication,
  );
  const [maxAmount, setMaxAmount] = useState({ value: 0, error: false });

  const [reference, setReference] = useMessageField(
    getInitialData(props.prevState?.rawTx, props.initialValue?.reference),
  );
  const [amount, setAmountField] = useAmountField(
    getInitialAmount(
      props.prevState?.rawTx,
      props.initialValue?.amount,
    ),
    account.summary?.balance,
    token.symbol,
  );
  const [recipient, setRecipientField] = useRecipientField(
    getInitialRecipient(props.prevState?.rawTx, props.initialValue?.recipient),
  );

  const onComposed = useCallback((status) => {
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    setMaxAmount(status.maxAmount);
  }, []);

  const onConfirm = useCallback((rawTx, trnxData, selectedPriority, fees) => {
    nextStep({
      transactionData: trnxData,
      selectedPriority,
      rawTx,
      fees,
    });
  }, []);

  const handleRemoveMessage = useCallback(() => {
    setReference({ target: { value: '' } });
  }, []);

  const isValid = useMemo(() => [
    amount,
    recipient,
    reference,
    recipientChain,
    sendingChain,
    token,
  ].reduce((result, item) => {
    result = result && !item.error && (!item.required || item.value !== '') && Object.keys(result);

    return result;
  }, true), [
    amount,
    recipient,
    reference,
    recipientChain,
    sendingChain,
  ]);

  const transaction = {
    isValid,
    moduleCommandID: MODULE_COMMANDS_NAME_ID_MAP.transfer,
    params: {
      amount: toRawLsk(amount.value),
      data: reference.value,
      recipient: {
        address: recipient.value,
        title: recipient.title,
      },
    },
  };

  const formData = {
    sendingChain,
    recipientChain,
    token,
    recipient,
    amount: toRawLsk(amount.value),
    data: reference.value,
  };
  console.log('---->>> ', reference,  setReference);
  return (
    <section className={styles.wrapper}>
      <TxComposer
        onComposed={onComposed}
        onConfirm={onConfirm}
        transaction={transaction}
        transactionData={formData}
        buttonTitle={t('Go to confirmation')}
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Send Tokens')}</h2>
          </BoxHeader>
          <BoxContent className={styles.formSection}>
            <div className={`${styles.ApplilcationFieldWrapper}`}>
              <div>
                <label className={`${styles.fieldLabel} sending-application`}>
                  <span>{t('From Application')}</span>
                </label>
                <MenuSelect
                  value={sendingChain}
                  onChange={(value) => setSendingChain(value)}
                  select={(selectedValue, option) => selectedValue.chainID === option.chainID}
                >
                  {applications.map((chain) => (
                    <MenuItem
                      className={styles.chainOptionWrapper}
                      value={chain}
                      key={chain.chainID}
                    >
                      <img className={styles.chainLogo} src={chainLogo} />
                      <span>{chain.name}</span>
                    </MenuItem>
                  ))}
                </MenuSelect>
              </div>
              <div>
                <Icon name="transferArrow" />
              </div>
              <div>
                <label className={`${styles.fieldLabel} recipient-application`}>
                  <span>{t('To Application')}</span>
                </label>
                <MenuSelect
                  value={recipientChain}
                  onChange={(value) => setRecipientChain(value)}
                  select={(selectedValue, option) => selectedValue.chainID === option.chainID}
                >
                  {applications.map((chain) => (
                    <MenuItem
                      className={styles.chainOptionWrapper}
                      value={chain}
                      key={chain.chainID}
                    >
                      <img className={styles.chainLogo} src={chainLogo} />
                      <span>{chain.name}</span>
                    </MenuItem>
                  ))}
                </MenuSelect>
              </div>
            </div>
            <div className={`${styles.fieldGroup} token`}>
              <label className={`${styles.fieldLabel}`}>
                <span>{t('Token')}</span>
              </label>
              <span className={styles.balance}>
                Balance:&nbsp;&nbsp;
                <span>
                  <TokenAmount val={amount} />
                  {token.symbol}
                </span>
              </span>
              <MenuSelect
                value={token}
                onChange={(value) => setToken(value)}
                select={(selectedValue, option) => selectedValue.name === option.name}
              >
                {mockAppTokens.map((tokenValue) => (
                  <MenuItem
                    className={styles.chainOptionWrapper}
                    value={tokenValue}
                    key={tokenValue.name}
                  >
                    <img className={styles.chainLogo} src={chainLogo} />
                    <span>{tokenValue.name}</span>
                  </MenuItem>
                ))}
              </MenuSelect>
            </div>
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
