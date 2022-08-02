import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { regex } from 'src/const/regex';
import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { getDelegate } from '@dpos/validator/api';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { Input } from 'src/theme';
import Tooltip from 'src/theme/Tooltip';
import TxComposer from '@transaction/components/TxComposer';
import styles from './form.css';

const validateUsername = (query, t) => {
  if (query.length === 0) {
    return t('Username can not be empty.');
  }
  if (query.length < 2) {
    return t('Username is too short.');
  }
  if (query.length > 20) {
    return t('Username is too long.');
  }
  const hasInvalidChars = query.replace(regex.delegateSpecialChars, '');
  if (hasInvalidChars) {
    return t(`Invalid character ${hasInvalidChars.trim()}`);
  }
  return '';
};

// eslint-disable-next-line max-statements
const RegisterDelegateForm = ({
  nextStep,
  prevState,
}) => {
  const timeout = useRef();
  const { t } = useTranslation();
  const network = useSelector(state => state.network);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(prevState?.rawTx?.params.username ?? '');

  const onConfirm = (rawTx) => {
    nextStep({ rawTx });
  };

  const checkUsername = () => {
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setLoading(true);
      getDelegate({ network, params: { username } })
        .then((response) => {
          setLoading(false);
          if (response.data.length) {
            setError(t('"{{username}}" is already taken.', { username }));
          }
        })
        .catch(() => setLoading(false));
    }, 1000);
  };

  const onChangeUsername = ({ target: { value } }) => {
    setError(validateUsername(value, t));
    setUsername(value);
  };

  useEffect(() => {
    if (!error && username) {
      checkUsername();
    }
  }, [username]);

  const transaction = {
    moduleCommandID: MODULE_COMMANDS_NAME_ID_MAP.registerDelegate,
    params: {
      username,
    },
    isValid: !error && username.length > 0 && !loading,
  };

  return (
    <section className={styles.wrapper}>
      <TxComposer
        onConfirm={onConfirm}
        transaction={transaction}
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Register delegate')}</h2>
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
                value={username}
                placeholder={t('e.g. peter_pan')}
                className={`${styles.inputUsername} select-name-input`}
                error={error}
                isLoading={loading}
                status={error ? 'error' : 'ok'}
                feedback={error}
              />
            </div>
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};

export default RegisterDelegateForm;
