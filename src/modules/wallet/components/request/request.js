/* eslint-disable max-statements */
import React, { useEffect, useMemo, useReducer } from 'react';
import { regex } from 'src/const/regex';
import { maxMessageLength } from '@transaction/configuration/transactions';
import {
  useApplicationExploreAndMetaData,
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import { useNetworkSupportedTokens } from '@token/fungible/hooks/queries';
import { validateAmount } from 'src/utils/validators';
import { getLogo } from '@token/fungible/utils/helpers';
import { sizeOfString } from 'src/utils/helpers';
import { Input } from 'src/theme';
import Converter from 'src/modules/common/components/converter';
import { useCurrentAccount } from 'src/modules/account/hooks';
import i18n from 'src/utils/i18n/i18n';
import Div from '@common/components/div/Div';
import { useTranslation } from 'react-i18next';
import MessageField from '../../../token/fungible/components/MessageField';
import MenuSelect, { MenuItem } from '../MenuSelect';
import RequestWrapper from './requestWrapper';
import styles from './request.css';
import WalletVisual from '../walletVisual';

const restrictedCharacters = ['&'];
const requestInitState = {
  amount: {
    error: false,
    value: '',
    loading: false,
    feedback: '',
    optional: false,
  },
  reference: {
    error: false,
    value: '',
    loading: false,
    feedback: '',
    optional: true,
  },
  token: {
    error: false,
    value: '',
    loading: false,
    feedback: '',
    optional: false,
  },
  recipientChain: {
    error: false,
    value: {},
    loading: false,
    feedback: '',
    optional: false,
  },
};

const Account = () => {
  const [currentAccount] = useCurrentAccount();
  const { address, name } = currentAccount.metadata || {};

  return (
    <div className={styles.accountWrapper}>
      <WalletVisual address={address} size={40} />
      <div>
        <b className={`${styles.addressValue}`}>{name}</b>
        <p className={`${styles.addressValue}`}>{address}</p>
      </div>
    </div>
  );
};

const Request = () => {
  const [
    {
      metadata: { address },
    },
  ] = useCurrentAccount();
  const [currentApplication] = useCurrentApplication();
  const { applications } = useApplicationManagement();

  const { t } = useTranslation();

  requestInitState.recipientChain.value = currentApplication;

  const [state, dispatch] = useReducer(
    (stateData, value) => ({ ...stateData, ...value }),
    requestInitState
  );
  const applicationExploreAndMetaData = useApplicationExploreAndMetaData();
  const networkSupportedTokens = useNetworkSupportedTokens(state.recipientChain.value);
  const { recipientChain, token, amount, reference } = state;
  const selectedToken = networkSupportedTokens.data?.find(({ tokenID }) => tokenID === token.value);
  const shareLink = useMemo(
    () =>
      Object.keys(state).reduce((link, fieldName) => {
        const field = state[fieldName];

        return field.value !== ''
          ? `${link}&${fieldName}=${encodeURIComponent(
              fieldName === 'recipientChain' ? field.value.chainID : field.value
            )}`
          : link;
      }, `${LISK_DOMAIN}/send?recipient=${address}`),
    [address, state]
  );
  const mainChainApplication = useMemo(
    () => applications.find(({ chainID }) => /0{4}$/.test(chainID)),
    [applications]
  );
  const requestingApplications = useMemo(() => {
    if (mainChainApplication.chainID !== currentApplication.chainID) {
      return [mainChainApplication, ...applicationExploreAndMetaData.applications];
    }

    return applicationExploreAndMetaData.applications;
  }, [mainChainApplication, currentApplication]);

  const handleFieldChange = ({ target }) => {
    const byteCount = sizeOfString(target.value);
    let error =
      target.name === 'amount'
        ? validateAmount({
            amount: target.value,
            locale: i18n.language,
            token: selectedToken,
            checklist: ['MAX_ACCURACY', 'FORMAT', 'NEGATIVE_AMOUNT'],
          }).message
        : byteCount > maxMessageLength;
    let feedback = '';

    if (target.name === 'amount') {
      const { leadingPoint } = regex.amount[i18n.language];
      target.value = leadingPoint.test(target.value) ? `0${target.value}` : target.value;
      feedback = error || feedback;
    } else if (target.name === 'reference' && byteCount > 0) {
      const hasRestirctedChar = restrictedCharacters.some((character) =>
        target.value?.includes(character)
      );

      if (hasRestirctedChar) {
        error = true;
        feedback = `${restrictedCharacters.join(',')} ${
          restrictedCharacters.length > 1 ? 'are' : 'is a'
        } restricted characters`;
      } else {
        feedback = t('{{length}} bytes left', { length: maxMessageLength - byteCount });
      }
    }

    dispatch({
      [target.name]: {
        ...state[target.name],
        feedback,
        error: !!error,
        loading: false,
        value: target.value,
      },
    });
  };

  useEffect(() => {
    handleFieldChange({
      target: { name: 'token', value: networkSupportedTokens.data?.[0]?.tokenID },
    });
  }, [networkSupportedTokens.isFetched, recipientChain]);

  const onSelectReceipentChain = (value) => {
    handleFieldChange({
      target: { name: 'recipientChain', value },
    });
  };

  const onSelectToken = (value) => {
    handleFieldChange({
      target: { name: 'token', value },
    });
  };

  const onRemoveMessageField = () => {
    handleFieldChange({
      target: { name: 'reference', value: '' },
    });
  };

  const isFormInvalid = Object.values(state).some(
    ({ error, value, optional }) => !!error || (!value && !optional)
  );

  return (
    <RequestWrapper
      copyLabel={t('Copy link')}
      copyValue={shareLink}
      t={t}
      title={t('Request tokens')}
      className="request-wrapper"
      disabled={isFormInvalid}
    >
      <span className={`${styles.label}`}>
        {t(
          'Use the sharing link to easily request any amount of tokens from Lisk Desktop or Lisk Mobile users.'
        )}
      </span>
      <p>{t('Account')}</p>
      <Account />
      <label className={`${styles.fieldGroup} recipient-application`}>
        <span className={`${styles.fieldLabel}`}>{t('Recipient application')}</span>
        <span className={`${styles.amountField}`}>
          <MenuSelect
            className="recipient-chain-select"
            isLoading={applicationExploreAndMetaData.isLoading}
            value={recipientChain.value}
            onChange={onSelectReceipentChain}
            select={(selectedValue, option) => selectedValue?.chainID === option.chainID}
            feedback={t('Failed to fetch applications metadata.')}
            status={
              applicationExploreAndMetaData.isError ||
              applicationExploreAndMetaData.applications?.length === 0
                ? 'error'
                : 'ok'
            }
            size="m"
          >
            {requestingApplications?.map((chain) => (
              <MenuItem className={styles.chainOptionWrapper} value={chain} key={chain.chainID}>
                <img className={styles.chainLogo} src={getLogo({ logo: chain.logo })} />
                <span>{chain.chainName}</span>
              </MenuItem>
            ))}
          </MenuSelect>
        </span>
      </label>
      <label className={`${styles.fieldGroup} token`}>
        <span className={`${styles.fieldLabel}`}>{t('Token')}</span>
        <span className={`${styles.amountField}`}>
          <MenuSelect
            className="token-select"
            onChange={onSelectToken}
            value={token.value}
            isLoading={networkSupportedTokens.isLoading}
            feedback={t('Failed to fetch supported tokens metadata.')}
            status={
              networkSupportedTokens.isError || networkSupportedTokens.data?.length === 0
                ? 'error'
                : 'ok'
            }
            size="m"
          >
            {networkSupportedTokens.data?.map(({ tokenName, tokenID, logo }) => (
              <MenuItem className={styles.chainOptionWrapper} value={tokenID} key={tokenID}>
                <img className={styles.chainLogo} src={getLogo({ logo })} />
                <span>{tokenName}</span>
              </MenuItem>
            ))}
          </MenuSelect>
        </span>
      </label>
      <label className={`${styles.fieldGroup}`}>
        <span className={`${styles.fieldLabel}`}>{t('Amount')}</span>
        <span className={`${styles.amountField} amount`}>
          <Input
            autoComplete="off"
            onChange={handleFieldChange}
            name="amount"
            value={amount.value}
            placeholder={t('Enter amount')}
            className={`${styles.input} amount-field`}
            status={amount.error ? 'error' : 'ok'}
            feedback={amount.feedback}
            isLoading={amount.loading}
            size="m"
          />
          <Converter
            Wrapper={Div}
            className={styles.converter}
            value={amount.value}
            error={amount.error}
            tokenSymbol={selectedToken?.symbol}
          />
        </span>
      </label>
      <MessageField
        t={t}
        name="reference"
        reference={reference.value}
        onChange={handleFieldChange}
        maxMessageLength={maxMessageLength}
        isLoading={reference.loading}
        error={reference.error}
        feedback={reference.feedback}
        label={t('Message (Optional)')}
        placeholder={t('Enter message')}
        onRemove={onRemoveMessageField}
      />
    </RequestWrapper>
  );
};

export default Request;
