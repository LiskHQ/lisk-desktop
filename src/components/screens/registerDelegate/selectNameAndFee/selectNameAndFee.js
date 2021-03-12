import React, { useState, useEffect, useRef } from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { Input } from '../../../toolbox/inputs';
import { PrimaryButton } from '../../../toolbox/buttons';
import { getDelegate } from 'utils/api/delegate';
import regex from 'utils/regex';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import styles from './selectNameAndFee.css';
import TransactionPriority from '../../../shared/transactionPriority/transactionPriority';
import useTransactionPriority from '../../send/form/useTransactionPriority';
import { tokenMap } from 'constants';
import useTransactionFeeCalculation from '../../send/form/useTransactionFeeCalculation';
import transactionTypes from 'constants';

const token = tokenMap.LSK.key;
const txType = transactionTypes().registerDelegate.key;

// eslint-disable-next-line max-statements
const SelectNameAndFee = ({ account, ...props }) => {
  const {
    t, nextStep, network, prevState,
  } = props;
  const timeout = useRef();

  const [state, _setState] = useState({
    nickname: '',
    error: '',
    inputDisabled: false,
    loading: false,
  });

  const [
    selectedPriority, selectTransactionPriority,
    priorityOptions, prioritiesLoadError, loadingPriorities,
  ] = useTransactionPriority(token);

  const { fee, minFee } = useTransactionFeeCalculation({
    selectedPriority,
    token,
    account,
    priorityOptions,
    txData: {
      txType,
      nonce: account.nonce,
      senderPublicKey: account.publicKey,
      username: state.nickname,
    },
  });

  const setState = newState => _setState(
    _state => (
      { ..._state, ...newState }
    ),
  );


  const getNicknameFromPrevState = () => {
    if (Object.entries(prevState).length) {
      setState({ nickname: prevState.nickname });
    }
  };

  const checkIfUserIsDelegate = () => {
    if (account && account.isDelegate) {
      setState({
        inputDisabled: true,
        error: t('You have already registered as a delegate.'),
      });
    }
  };

  const hasUserEnoughFunds = () => {
    const hasFunds = account
      && account.balance >= fee.value;

    if (!hasFunds) {
      setState({
        inputDisabled: true,
        error: t('Insufficient funds'),
      });
    }
  };

  const validateNickname = (nickname) => {
    if (nickname.length > 20) {
      return t('Nickname is too long.');
    }
    const hasInvalidChars = nickname.replace(regex.delegateSpecialChars, '');
    if (hasInvalidChars) {
      return t(`Invalid character ${hasInvalidChars.trim()}`);
    }
    return '';
  };

  const isNicknameFree = (username) => {
    clearTimeout(timeout);

    timeout.current = setTimeout(() => {
      getDelegate({ network, params: { username } })
        .then((response) => {
          if (response.data.length) {
            setState({
              loading: false,
              error: t('"{{username}}" is already taken.', { username }),
            });
          } else {
            setState({ loading: false });
          }
        })
        .catch(() => setState({ loading: false }));
    }, 1000);
  };

  const onChangeNickname = ({ target: { value } }) => {
    const error = validateNickname(value);
    if (value.length && !error) {
      isNicknameFree(value);
    }
    setState({
      loading: value.length && !error,
      nickname: value,
      error,
    });
  };

  const changeCustomFee = (customFee) => {
    setState({ customFee });
  };

  useEffect(() => {
    getNicknameFromPrevState();
    checkIfUserIsDelegate();
  }, []);

  useEffect(() => {
    hasUserEnoughFunds();
  }, [fee]);

  const isBtnDisabled = () => {
    if (state.customFee && state.customFee.error) return true;
    return !!state.error || state.nickname.length === 0 || state.loading;
  };

  return (
    <Box width="medium" className={styles.box}>
      <BoxHeader>
        <h1>{t('Become a delegate')}</h1>
      </BoxHeader>
      <BoxContent className={`${styles.container} select-name-container`}>
        <p className={`${styles.description} select-name-text-description`}>
          {
            t(`Delegates are the most commited Lisk community members responsible for 
          securing the network and processing all the transactions on Lisk’s blockchain 
          network.`)
          }
        </p>
        <p className={`${styles.description} select-name-text-description`}>
          {
            t('The top 101 delegates are able to forge new blocks and receive forging rewards.')
          }
        </p>
        <label className={styles.nicknameLabel}>
          {t('Your nickname')}
          <Tooltip position="right">
            <p>{t('Max. 20 characters, a-z, 0-1, no special characters except !@$_.')}</p>
          </Tooltip>
        </label>
        <div className={styles.inputContainer}>
          <Input
            data-name="delegate-nickname"
            autoComplete="off"
            onChange={onChangeNickname}
            name="delegate-nickname"
            value={state.nickname}
            placeholder={t('ie. peter_pan')}
            className={`${styles.inputNickname} select-name-input`}
            disabled={state.inputDisabled}
            error={state.error}
            isLoading={state.loading}
            status={state.error ? 'error' : 'ok'}
            feedback={state.error}
          />
        </div>
        <TransactionPriority
          token={token}
          fee={fee}
          minFee={minFee.value}
          customFee={state.customFee ? state.customFee.value : undefined}
          txType={txType}
          setCustomFee={changeCustomFee}
          priorityOptions={priorityOptions}
          selectedPriority={selectedPriority.selectedIndex}
          setSelectedPriority={selectTransactionPriority}
          loadError={prioritiesLoadError}
          isLoading={loadingPriorities}
        />
      </BoxContent>
      <BoxFooter>
        <PrimaryButton
          onClick={() => {
            nextStep({
              nickname: state.nickname,
              fee: state.customFee ? state.customFee.value : fee.value,
            });
          }}
          disabled={isBtnDisabled()}
          className={`${styles.confirmBtn} confirm-btn`}
        >
          {t('Go to confirmation')}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default SelectNameAndFee;
