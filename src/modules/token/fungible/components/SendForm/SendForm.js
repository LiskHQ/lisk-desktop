/* eslint-disable max-lines */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Piwik from 'src/utils/piwik';
import { useHistory } from 'react-router-dom';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import AmountField from '@common/components/amountField';
import TokenAmount from '@token/fungible/components/tokenAmount';
import Icon from '@theme/Icon';
import { convertToBaseDenom, convertFromBaseDenom, getLogo } from '@token/fungible/utils/helpers';
import BoxContent from '@theme/box/content';
import BoxHeader from '@theme/box/header';
import { maxMessageLength } from '@transaction/configuration/transactions';
import {
  useApplicationExploreAndMetaData,
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import MenuSelect, { MenuItem } from '@wallet/components/MenuSelect';
import TxComposer from '@transaction/components/TxComposer';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { getTokenBalanceErrorMessage } from 'src/modules/common/utils/getTokenBalanceErrorMessage';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import useAmountField from '../../hooks/useAmountField';
import useMessageField from '../../hooks/useMessageField';
import { useTransferableTokens } from '../../hooks';
import useRecipientField from '../../hooks/useRecipientField';
import styles from './form.css';
import MessageField from '../MessageField';
import { useTokenBalances, useValidateFeeBalance } from '../../hooks/queries';

const getInitialData = (formProps, initialValue) => formProps?.params.data || initialValue || '';
const getInitialAmount = (formProps, initialValue, token) =>
  Number(formProps?.params.amount)
    ? convertFromBaseDenom(formProps?.params.amount, token)
    : initialValue || '';
const getInitialRecipient = (formProps, initialValue) =>
  formProps?.params.recipient.address || initialValue || '';
const getInitialRecipientChain = (
  recipientChain,
  initialChainId,
  currentApplication,
  applications
) => {
  const initialRecipientChain = initialChainId
    ? applications.find(({ chainID }) => chainID === initialChainId)
    : null;

  return recipientChain || initialRecipientChain || currentApplication;
};
const getInitialToken = (transactionData, initialTokenId, tokens) => {
  const initialToken = initialTokenId
    ? tokens.find(({ tokenID }) => tokenID === initialTokenId)
    : null;
  return transactionData?.token || initialToken || tokens[0];
};

// eslint-disable-next-line max-statements
const SendForm = (props) => {
  const { prevState, t, bookmarks, nextStep } = props;
  const history = useHistory();
  const [recipientChain, setRecipientChain] = useState({});
  const [token, setToken] = useState({});
  const [maxAmount, setMaxAmount] = useState({ value: 0, error: false });
  const [currentApplication] = useCurrentApplication();
  const sendingChain = prevState?.transactionData?.sendingChain || currentApplication;
  const { applications } = useApplicationExploreAndMetaData();
  const { data: tokens, isLoading: isLoadingTokens } = useTransferableTokens(recipientChain);
  const [reference, setReference] = useMessageField(
    getInitialData(props.prevState?.formProps, props.initialValue?.reference)
  );
  const [amount, setAmountField] = useAmountField(
    getInitialAmount(props.prevState?.formProps, props.initialValue?.amount, token),
    token?.availableBalance,
    token
  );
  const [recipient, setRecipientField] = useRecipientField(
    getInitialRecipient(
      props.prevState?.formProps,
      props.initialValue?.address ?? props.initialValue?.recipient
    )
  );
  const { applications: managedApps } = useApplicationManagement();
  const tokenBalanceQuery = useTokenBalances();
  const {
    hasSufficientBalanceForFee,
    feeToken,
    isLoading: isLoadingFeeBalance,
  } = useValidateFeeBalance();

  const mainChainApplication = useMemo(
    () => managedApps.find(({ chainID }) => /0{4}$/.test(chainID)),
    [managedApps]
  );

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

  const isFormValid = useMemo(() => {
    const areFieldsValid = [amount, recipient, reference, recipientChain, sendingChain].reduce(
      (result, item) => {
        result =
          result &&
          !item?.error &&
          (!item?.required || item?.value !== '') &&
          !Object.keys(result).length;

        return result;
      },
      true
    );
    const isTokenValid = !!token && !!Object.keys(token).length;
    return areFieldsValid && isTokenValid;
  }, [amount, recipient, reference, recipientChain, sendingChain, token]);

  useEffect(() => {
    if (!isLoadingFeeBalance && !tokenBalanceQuery.isLoading) {
      const hasTokenWithBalance = tokenBalanceQuery.data?.data?.some(
        (tokenBalance) => BigInt(tokenBalance?.availableBalance || 0) > BigInt(0)
      );

      const tokenBalanceError = getTokenBalanceErrorMessage({
        errorType: 'sendToken',
        hasSufficientBalanceForFee,
        feeTokenSymbol: feeToken?.symbol,
        hasAvailableTokenBalance: hasTokenWithBalance,
        t,
      });

      if (Object.values(tokenBalanceError).length) {
        addSearchParamsToUrl(history, { modal: 'noTokenBalance', ...tokenBalanceError });
      }
    }
  }, [isLoadingFeeBalance, tokenBalanceQuery.isLoading]);

  useEffect(() => {
    setToken(getInitialToken(prevState?.transactionData, props.initialValue?.token, tokens));
  }, [prevState?.transactionData, props.initialValue?.token, tokens]);

  useEffect(() => {
    setRecipientChain(
      getInitialRecipientChain(
        prevState?.formProps?.fields?.recipientChain,
        props.initialValue?.recipientChain,
        currentApplication,
        applications
      )
    );
  }, [
    applications.length,
    currentApplication,
    props.initialValue?.recipientChain,
    prevState?.transactionData,
  ]);

  const sendFormProps = {
    isFormValid,
    moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
    params: {
      amount: convertToBaseDenom(amount.value, token),
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
  };

  let commandParams = {
    tokenID: token?.tokenID,
    amount: convertToBaseDenom(amount.value, token),
    recipientAddress: recipient.value,
    data: reference.value,
  };

  if (sendingChain.chainID !== recipientChain.chainID) {
    commandParams = {
      ...commandParams,
      receivingChainID: recipientChain.chainID,
    };
    sendFormProps.moduleCommand = MODULE_COMMANDS_NAME_MAP.transferCrossChain;
  }

  const toApplications = useMemo(() => {
    if (mainChainApplication.chainID !== currentApplication.chainID) {
      return [mainChainApplication, ...applications];
    }

    return applications;
  }, [mainChainApplication, currentApplication]);

  return (
    <section className={styles.wrapper} data-testid="send-form-wrapper">
      <TxComposer
        onComposed={onComposed}
        onConfirm={onConfirm}
        formProps={sendFormProps}
        commandParams={commandParams}
        buttonTitle={t('Continue to summary')}
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Send tokens')}</h2>
          </BoxHeader>
          <BoxContent className={styles.formSection}>
            <div className={`${styles.ApplicationFieldWrapper}`}>
              <div>
                <label className={`${styles.fieldLabel} sending-application`}>
                  <span>{t('From application')}</span>
                </label>
                <MenuSelect
                  value={sendingChain}
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
                  {toApplications.map((application) => (
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
                {!!token?.availableBalance && <span>{t('Balance:')}&nbsp;&nbsp;</span>}
                <span>
                  <TokenAmount val={token?.availableBalance} token={token} />
                </span>
              </span>
              <MenuSelect
                value={token}
                onChange={(value) => setToken(value)}
                isLoading={isLoadingTokens}
                select={(selectedValue, option) => selectedValue?.tokenName === option.tokenName}
              >
                {tokens.map((tokenValue) => (
                  <MenuItem
                    className={styles.chainOptionWrapper}
                    value={tokenValue}
                    key={tokenValue.tokenName}
                  >
                    <img className={styles.chainLogo} src={getLogo(tokenValue)} alt="Token logo" />
                    <span>{tokenValue.tokenName}</span>
                  </MenuItem>
                ))}
              </MenuSelect>
            </div>
            <AmountField
              amount={amount}
              token={token}
              onChange={setAmountField}
              maxAmount={maxAmount}
              displayConverter
              label={t('Amount')}
              placeholder={t('Enter amount')}
              name="amount"
              disabled={isLoadingTokens}
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
              placeholder={t('Enter message')}
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
