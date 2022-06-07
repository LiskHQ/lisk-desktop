import React, { useState, useRef } from 'react';
import { regex } from 'src/const/regex';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { getDelegate } from '@dpos/validator/api';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { Input } from 'src/theme';
import Tooltip from 'src/theme/Tooltip';
import TxComposer from '@transaction/components/TxComposer';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from './form.css';

const RegisterDelegateForm = ({
  nextStep,
  prevState,
}) => {
  const timeout = useRef();
  const { t } = useTranslation();
  const network = useSelector(state => state.network);

  const [username, setUsername] = useState({
    value: '',
    error: '',
    loading: false,
  });

  const onComposed = (/* get the tx here */) => {
    nextStep();
  };

  const validateUsername = (query) => {
    if (query.length > 20) {
      return t('Username is too long.');
    }
    const hasInvalidChars = query.replace(regex.delegateSpecialChars, '');
    if (hasInvalidChars) {
      return t(`Invalid character ${hasInvalidChars.trim()}`);
    }
    return '';
  };

  const isUsernameFree = (value) => {
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      getDelegate({ network, params: { username: value } })
        .then((response) => {
          if (response.data.length) {
            setUsername({
              value,
              loading: false,
              error: t('"{{username}}" is already taken.', { username: value }),
            });
          } else {
            setUsername({
              ...username,
              loading: false,
            });
          }
        })
        .catch(() => setUsername({ ...username, loading: false }));
    }, 1000);
  };

  const onChangeUsername = ({ target: { value } }) => {
    const error = validateUsername(value);
    if (value.length && !error) {
      isUsernameFree(value);
    }
    setUsername({
      loading: value.length && !error,
      value,
      error,
    });
  };

  const transaction = {
    moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.registerDelegate,
    asset: {
      username: username.value,
    },
    isValid: !username.error && username.value.length > 0 && !username.loading,
  };

  return (
    <TxComposer
      className={styles.box}
      onComposed={onComposed}
      transaction={transaction}
    >
      <>
        <BoxHeader>
          <h1>{t('Register delegate')}</h1>
        </BoxHeader>
        <BoxContent className={`${styles.container} select-name-container`}>
          <p className={`${styles.description} select-name-text-description`}>
            {t(
              'Register as a delegate to assign a username and allow votes to be locked to your account.',
            )}
          </p>
          <p className={`${styles.description} select-name-text-description`}>
            {t(
              'Depending on the number of votes locked to your account (delegate weight), your account can become eligible to forge new blocks on the Lisk blockchain. With every new round (103 blocks), the top 101 active delegates and 2 randomly selected standby delegates each become eligible to forge a new block. For each block forged and accepted by the Lisk network, a delegate receives a new block reward and the transaction fees collected from each sender. The minimum required delegate weight to become eligible is 1000 LSK.',
            )}
          </p>
          <label className={styles.usernameLabel}>
            {t('Your username')}
            <Tooltip position="right">
              <p>
                {t(
                  'Max. 20 characters, a-z, 0-1, no special characters except !@$_.',
                )}
              </p>
            </Tooltip>
          </label>
          <div className={styles.inputContainer}>
            <Input
              data-name="delegate-username"
              autoComplete="off"
              onChange={onChangeUsername}
              name="delegate-username"
              value={username.username}
              placeholder={t('e.g. peter_pan')}
              className={`${styles.inputUsername} select-name-input`}
              error={username.error}
              isLoading={username.loading}
              status={username.error ? 'error' : 'ok'}
              feedback={username.error}
            />
          </div>
        </BoxContent>
      </>
    </TxComposer>
  );
};

export default RegisterDelegateForm;
