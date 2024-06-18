/* eslint-disable max-lines */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from 'src/routes/routes';
import { PrimaryButton } from 'src/theme/buttons';
import Tooltip from '@theme/Tooltip/tooltip';
import Input from '@theme/Input';

import styles from './ImportPrivateKeyForm.css';

const ImportPrivateKeyForm = ({ settings, onAddAccount }) => {
  const [privateKey, setPass] = useState({ value: '', isValid: false });

  const setPrivateKey = (value, error) => {
    setPass({
      value,
      isValid: !error,
    });
  };

  const props = { settings, onAddAccount, setPrivateKey, privateKey };

  return <AddAccountFormContainer {...props} />;
};

const AddAccountFormContainer = ({
  privateKey,
  onAddAccount,
  isSubmitDisabled,
                                   setPrivateKey,
}) => {
  const { t } = useTranslation();

  const onFormSubmit = (e) => {
    e.preventDefault();
    // istanbul ignore else
    if (privateKey.value) {
      onAddAccount(privateKey);
    }
  };

  return (
    <div className={`${styles.addAccount}`}>
      <div className={`${styles.wrapper} ${grid['col-xs-12']}`}>
        <div className={`${styles.titleHolder} ${grid['col-xs-12']}`}>
          <h1>{t('Add your account')}</h1>
          <p>{t('Enter your private key to manage your account.')}</p>
        </div>
        <form onSubmit={onFormSubmit}>
          <div className={styles.inputFields}>
            <fieldset>

              <Input
                size="l"
                secureTextEntry
                onChange={(e) => setPrivateKey(e.target.value)}
                // feedback={errors.password?.message}
                // status={errors.password ? 'error' : undefined}
                placeholder={t('Enter private key')}
                label={
                  <span className="password-label-wrapper">
                {t('Private key')}
                    <Tooltip position="right" title={t('Requirements')}>
                  <p>
                    {t(
                      'Private key should be represented as a hexadecimal string with length of 64 characters.'
                    )}
                  </p>
                </Tooltip>
              </span>
                }
              />
            </fieldset>
          </div>
          <div className={`${styles.buttonsHolder}`}>
            <PrimaryButton
              className={`${styles.button} login-button`}
              type="submit"
              disabled={isSubmitDisabled}
            >
              {t('Continue to set password')}
            </PrimaryButton>
            <Link
              className={`${styles.backLink} signin-hwWallet-button`}
              to={routes.addAccountOptions.path}
            >
              {t('Go back')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportPrivateKeyForm;
