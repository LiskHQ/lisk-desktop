/* eslint-disable max-lines */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import routes from '@screens/router/routes';
import { PrimaryButton } from 'src/theme/buttons';
import PassphraseInput from 'src/modules/wallet/components/PassphraseInput/PassphraseInput';
import DiscreetModeToggle from 'src/modules/settings/components/discreetModeToggle';
import NetworkSelector from 'src/modules/settings/components/networkSelector';
import styles from './AddAccountForm.css';

const AddAccountForm = ({
  settings, onAddAccount,
}) => {
  const { t } = useTranslation();
  const [passphrase, setPass] = useState({ value: '', isValid: false });

  const setPassphrase = (value, error) => {
    setPass({
      value,
      isValid: !error,
    });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (passphrase.value && passphrase.isValid) {
      onAddAccount(passphrase);
    }
  };

  const handleKeyPress = (e) => {
    if (e.charCode === 13) onFormSubmit(e);
  };

  return (
    <div className={`${styles.addAccount}`}>
      <div
        className={`${styles.wrapper} ${grid['col-xs-12']}`}
      >
        <div className={`${styles.titleHolder} ${grid['col-xs-12']}`}>
          <h1>{t('Add account')}</h1>
          <p>
            {t('Enter your secret recovery phrase to manage your account.')}
          </p>
        </div>
        <form onSubmit={onFormSubmit}>
          <div className={styles.inputFields}>
            {settings.showNetwork && (
            <fieldset>
              <label>{t('Select Network')}</label>
              <NetworkSelector />
            </fieldset>
            )}
            <fieldset>
              <label>{t('Secret recovery phrase')}</label>
              <PassphraseInput
                inputsLength={12}
                maxInputsLength={24}
                onFill={setPassphrase}
                keyPress={handleKeyPress}
              />
            </fieldset>
            <DiscreetModeToggle className={styles.discreetMode} />
          </div>
          <div className={`${styles.buttonsHolder}`}>
            <PrimaryButton
              className={`${styles.button} login-button`}
              type="submit"
              disabled={!passphrase.isValid}
            >
              {t('Continue')}
            </PrimaryButton>
            <Link
              className={`${styles.backLink} signin-hwWallet-button`}
              to={routes.addAccountChoice.path}
            >
              {t('Go Back')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountForm;
