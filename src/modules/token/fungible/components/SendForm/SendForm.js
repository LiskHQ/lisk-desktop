import React, { useCallback, useMemo, useState } from 'react';
import Piwik from 'src/utils/piwik';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import AmountField from '@common/components/amountField';
import { useGetInitializationFees } from '@auth/hooks/queries';
import TokenAmount from '@token/fungible/components/tokenAmount';
import Icon from '@theme/Icon';
import { toRawLsk, fromRawLsk } from '@token/fungible/utils/lsk';
import BoxContent from '@theme/box/content';
import BoxHeader from '@theme/box/header';
import { maxMessageLength } from '@transaction/configuration/transactions';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import MenuSelect, { MenuItem } from '@wallet/components/MenuSelect';
import { useBlockchainApplicationExplore } from '@blockchainApplication/explore/hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import TxComposer from '@transaction/components/TxComposer';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import useAmountField from '../../hooks/useAmountField';
import useMessageField from '../../hooks/useMessageField';
import { useTransferableTokens } from '../../hooks';
import useRecipientField from '../../hooks/useRecipientField';
import { getLogo } from '../../utils/service';
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
  const initialRecipientChain = initialChainId
    ? applications.find(({ chainID }) => chainID === initialChainId)
    : null;

  return transactionData?.recipientChain || initialRecipientChain || currentApplication;
};
const getInitialToken = (transactionData, initialTokenId, tokens) => {
  const initialToken = initialTokenId
    ? tokens.find(({ tokenID }) => tokenID === initialTokenId)
    : null;
  return transactionData?.token || initialToken || tokens[0];
};

// eslint-disable-next-line max-statements
const SendForm = (props) => {
  const { account = {}, prevState, t, bookmarks, nextStep } = props;
  const [currentApplication] = useCurrentApplication();
  const [sendingChain, setSendingChain] = useState(
    prevState?.transactionData?.sendingChain || currentApplication
  );
  const {
    data: { data: activeApps = [] } = {},
    isLoading: isLoadingActiveApps,
    error: errorGettingActiveApps,
  } = useBlockchainApplicationExplore({ config: { params: { state: 'active' } } });
  const activeAppsList = activeApps.map((app) => app.chainID).join();
  const { data: { data: applications = [] } = {} } = useBlockchainApplicationMeta({
    config: { params: { chainID: activeAppsList } },
    options: { enabled: !isLoadingActiveApps && !errorGettingActiveApps },
  });
  const [recipientChain, setRecipientChain] = useState(
    getInitialRecipientChain(
      prevState?.transactionData,
      props.initialValue?.recipientApplication,
      currentApplication,
      applications
    )
  );
  const { data: tokens } = useTransferableTokens(recipientChain);
  const [token, setToken] = useState(
    getInitialToken(prevState?.transactionData, props.initialValue?.token, tokens)
  );

  const [maxAmount, setMaxAmount] = useState({ value: 0, error: false });

  const [reference, setReference] = useMessageField(
    getInitialData(props.prevState?.formProps, props.initialValue?.reference)
  );
  const [amount, setAmountField] = useAmountField(
    getInitialAmount(props.prevState?.formProps, props.initialValue?.amount),
    account.summary?.balance,
    token?.symbol
  );
  const [recipient, setRecipientField] = useRecipientField(
    getInitialRecipient(props.prevState?.formProps, props.initialValue?.recipient)
  );
  const { data: initializationFees } = useGetInitializationFees({ address: recipient.value });

  const onComposed = useCallback((status) => {
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    setMaxAmount(status.maxAmount);
  }, []);

  const onConfirm = useCallback((formProps, transactionJSON, selectedPriority, fees) => {
    nextStep({
      selectedPriority,
      formProps,
      transactionJSON,
      fees,
    });
  }, []);

  const handleRemoveMessage = useCallback(() => {
    setReference({ target: { value: '' } });
  }, []);

  const isFormValid = useMemo(
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

  const sendFormProps = {
    isFormValid,
    moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
    params: {
      amount: toRawLsk(amount.value),
      data: reference.value,
      recipient: {
        address: recipient.value,
        title: recipient.title,
      },
      token: token ?? { tokenID: '' },
    },
    fields: {
      sendingChain,
      recipientChain,
      token,
      recipient,
    },
    extraCommandFee: initializationFees?.data?.userAccount || 0,
  };

  let commandParams = {
    tokenID: token?.tokenID,
    amount: toRawLsk(amount.value),
    recipientAddress: recipient.value,
    data: reference.value,
  };

  if (sendingChain.chainID !== recipientChain.chainID) {
    commandParams = {
      ...commandParams,
      receivingChainID: recipientChain.chainID,
      // TODO: Replace the message fee constant from service endpoint
      messageFee: 50000000,
    };
  }

  return (
    <section className={styles.wrapper}>
      <TxComposer
        onComposed={onComposed}
        onConfirm={onConfirm}
        formProps={sendFormProps}
        commandParams={commandParams}
        commandParamsWithMaxBalance={{ ...commandParams, amount: token?.availableBalance }}
        buttonTitle={t('Continue to summary')}
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Send Tokens')}</h2>
          </BoxHeader>
          <BoxContent className={styles.formSection}>
            <div className={`${styles.ApplilcationFieldWrapper}`}>
              <div>
                <label className={`${styles.fieldLabel} sending-application`}>
                  <span>{t('From application')}</span>
                </label>
                <MenuSelect
                  value={sendingChain}
                  onChange={(value) => setSendingChain(value)}
                  select={(selectedValue, option) => selectedValue?.chainID === option.chainID}
                  disabled
                >
                  {applications.map((application) => (
                    <MenuItem
                      className={styles.chainOptionWrapper}
                      value={application}
                      key={application.chainID}
                    >
                      <img
                        className={styles.chainLogo}
                        src={getLogo(application)}
                        alt="From application logo"
                      />
                      <span>{application.chainName}</span>
                    </MenuItem>
                  ))}
                </MenuSelect>
              </div>
              <div>
                <Icon name="transferArrow" />
              </div>
              <div>
                <label className={`${styles.fieldLabel} recipient-application`}>
                  <span>{t('To application')}</span>
                </label>
                <MenuSelect
                  value={recipientChain}
                  onChange={(value) => setRecipientChain(value)}
                  select={(selectedValue, option) => selectedValue?.chainID === option.chainID}
                >
                  {applications.map((application) => (
                    <MenuItem
                      className={styles.chainOptionWrapper}
                      value={application}
                      key={application.chainID}
                    >
                      <img
                        className={styles.chainLogo}
                        src={getLogo(application)}
                        alt="To application logo"
                      />
                      <span>{application.chainName}</span>
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
                {!!token?.availableBalance && <span>Balance:&nbsp;&nbsp;</span>}
                <span>
                  <TokenAmount val={token?.availableBalance} />
                  {token?.symbol}
                </span>
              </span>
              <MenuSelect
                value={token}
                onChange={(value) => setToken(value)}
                select={(selectedValue, option) => selectedValue?.name === option.name}
              >
                {tokens.map((tokenValue) => (
                  <MenuItem
                    className={styles.chainOptionWrapper}
                    value={tokenValue}
                    key={tokenValue.name}
                  >
                    <img className={styles.chainLogo} src={getLogo(tokenValue)} alt="Token logo" />
                    <span>{tokenValue.tokenName}</span>
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
              placeholder={t('Insert transaction amount')}
              name="amount"
            />
            <div className={`${styles.fieldGroup} ${styles.recipientFieldWrapper}`}>
              <span className={`${styles.fieldLabel}`}>{t('Recipient address')}</span>
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
