import React, { useState, useEffect, useRef } from 'react';
import { isEmpty } from '@utils/helpers';
import { tokenMap, MODULE_ASSETS_NAME_ID_MAP, regex } from '@constants';
import { getDelegate } from '@api/delegate';
import TransactionPriority, { useTransactionFeeCalculation, useTransactionPriority } from '@shared/transactionPriority';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import { Input } from '@toolbox/inputs';
import { PrimaryButton } from '@toolbox/buttons';
import Tooltip from '@toolbox/tooltip/tooltip';
import styles from './selectNameAndFee.css';

const token = tokenMap.LSK.key;
const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.registerDelegate;

// eslint-disable-next-line max-statements
const SelectNameAndFee = ({
  account, t, nextStep, network, prevState,
  signedTransaction, txSignatureError,
}) => {
  const timeout = useRef();

  const [state, _setState] = useState({
    username: '',
    error: '',
    inputDisabled: false,
    loading: false,
  });

  const [
    selectedPriority, selectTransactionPriority,
    priorityOptions, prioritiesLoadError, loadingPriorities,
  ] = useTransactionPriority(token);

  const { fee, minFee } = useTransactionFeeCalculation({
    network,
    selectedPriority,
    token,
    account,
    priorityOptions,
    transaction: {
      moduleAssetId,
      nonce: account.sequence?.nonce,
      senderPublicKey: account.summary?.publicKey,
      username: state.username,
    },
  });

  const setState = newState => _setState(
    _state => (
      { ..._state, ...newState }
    ),
  );

  const onConfirm = () => {
    nextStep({ rawTransaction: { fee, username: state.username } });
  };

  const getUsernameFromPrevState = () => {
    if (Object.entries(prevState).length) {
      setState({ username: prevState.username });
    }
  };

  const checkIfUserIsDelegate = () => {
    if (account?.isDelegate) {
      setState({
        inputDisabled: true,
        error: t('You have already registered as a delegate.'),
      });
    }
  };

  const hasUserEnoughFunds = () => {
    const hasFunds = account?.token?.balance >= fee.value;

    if (!hasFunds) {
      setState({
        inputDisabled: true,
        error: t('Insufficient funds'),
      });
    }
  };

  const validateUsername = (username) => {
    if (username.length > 20) {
      return t('Username is too long.');
    }
    const hasInvalidChars = username.replace(regex.delegateSpecialChars, '');
    if (hasInvalidChars) {
      return t(`Invalid character ${hasInvalidChars.trim()}`);
    }
    return '';
  };

  const isUsernameFree = (username) => {
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

  const onChangeUsername = ({ target: { value } }) => {
    const error = validateUsername(value);
    if (value.length && !error) {
      isUsernameFree(value);
    }
    setState({
      loading: value.length && !error,
      username: value,
      error,
    });
  };

  const changeCustomFee = (customFee) => {
    setState({ customFee });
  };

  useEffect(() => {
    getUsernameFromPrevState();
    checkIfUserIsDelegate();
  }, []);

  useEffect(() => {
    hasUserEnoughFunds();
  }, [fee]);

  useEffect(() => {
    // success
    if (!isEmpty(signedTransaction)) {
      nextStep({
        username: state.username,
        transactionInfo: signedTransaction,
      });
    }
  }, [signedTransaction]);

  useEffect(() => {
    // error
    if (txSignatureError) {
      nextStep({ error: txSignatureError });
    }
  }, [txSignatureError]);

  const isBtnDisabled = () => {
    if (state.customFee && state.customFee.error) return true;
    return !!state.error || state.username.length === 0 || state.loading;
  };

  return (
    <Box width="medium" className={styles.box}>
      <BoxHeader>
        <h1>{t('Register delegate')}</h1>
      </BoxHeader>
      <BoxContent className={`${styles.container} select-name-container`}>
        <p className={`${styles.description} select-name-text-description`}>
          {
            t('Register as a delegate to assign a username and allow votes to be locked to your account.')
          }
        </p>
        <p className={`${styles.description} select-name-text-description`}>
          {
            t('Depending on the number of votes locked to your account (delegate weight), your account can become eligible to forge new blocks on the Lisk blockchain. With every new round (103 blocks), the top 101 active delegates and 2 randomly selected standby delegates each become eligible to forge a new block. For each block forged and accepted by the Lisk network, a delegate receives a new block reward and the transaction fees collected from each sender. The minimum required delegate weight to become eligible is 1000 LSK.')
          }
        </p>
        <label className={styles.usernameLabel}>
          {t('Your username')}
          <Tooltip position="right">
            <p>{t('Max. 20 characters, a-z, 0-1, no special characters except !@$_.')}</p>
          </Tooltip>
        </label>
        <div className={styles.inputContainer}>
          <Input
            data-name="delegate-username"
            autoComplete="off"
            onChange={onChangeUsername}
            name="delegate-username"
            value={state.username}
            placeholder={t('e.g. peter_pan')}
            className={`${styles.inputUsername} select-name-input`}
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
          minFee={Number(minFee.value)}
          customFee={state.customFee ? state.customFee.value : undefined}
          moduleAssetId={moduleAssetId}
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
          onClick={onConfirm}
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
