import React, { useState, useEffect, useRef } from 'react';
import to from 'await-to-js';
import { signTransactionByHW } from '@utils/hwManager';
import { create, computeTransactionId } from '@api/transaction';
import { toRawLsk } from '@utils/lsk';
import {
  tokenMap,
  MODULE_ASSETS_NAME_ID_MAP,
  loginTypes,
  regex,
} from '@constants';
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
    transaction: {
      moduleAssetId,
      nonce: account.sequence?.nonce,
      senderPublicKey: account.summary?.publicKey,
      username: state.nickname,
    },
  });

  const setState = newState => _setState(
    _state => (
      { ..._state, ...newState }
    ),
  );

  // eslint-disable-next-line max-statements
  const onConfirm = async () => {
    const isHwSigning = account.loginType !== loginTypes.passphrase.code;
    const data = {
      network,
      account,
      transactionObject: {
        senderPublicKey: account.summary.publicKey,
        nonce: account.sequence?.nonce,
        fee: toRawLsk(parseFloat(fee.value)),
        username: state.nickname,
        moduleAssetId,
      },
      isHwSigning,
    };

    let [error, tx] = await to(
      create(data, tokenMap.LSK.key),
    );

    if (error) {
      nextStep({ error });
    }

    if (isHwSigning) {
      // tx contain txObject and txBytes that needs to be signed by HW
      [error, tx] = await to(signTransactionByHW(
        account,
        tx.networkIdentifier,
        tx.transactionObject,
        tx.transactionBytes,
      ));
      tx.id = computeTransactionId({ transaction: tx });
    }

    if (!error) {
      nextStep({
        nickname: state.nickname,
        transactionInfo: tx,
      });
    } else {
      nextStep({ error });
    }
  };

  const getNicknameFromPrevState = () => {
    if (Object.entries(prevState).length) {
      setState({ nickname: prevState.nickname });
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
        <h1>{t('Register delegate')}</h1>
      </BoxHeader>
      <BoxContent className={`${styles.container} select-name-container`}>
        <p className={`${styles.description} select-name-text-description`}>
          {
            t('Register as a delegate to assign a nickname and allow votes to be locked to your account.')
          }
        </p>
        <p className={`${styles.description} select-name-text-description`}>
          {
            t('Depending on the number of votes locked to your account (delegate weight), your account can become eligible to forge new blocks on the Lisk blockchain. With every new round (103 blocks), the top 101 active delegates and 2 randomly selected standby delegates each become eligible to forge a new block. For each block forged and accepted by the Lisk network, a delegate receives a new block reward and the transaction fees collected from each sender. The minimum required delegate weight to become eligible is 1000 LSK.')
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
            placeholder={t('e.g. peter_pan')}
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
