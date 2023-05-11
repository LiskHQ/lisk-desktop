/* eslint-disable max-lines */
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import routes from 'src/routes/routes';
import CustomDerivationPath from 'src/modules/auth/components/CustomDerivationPath';
import { PrimaryButton } from 'src/theme/buttons';
import PassphraseInput from 'src/modules/wallet/components/PassphraseInput/PassphraseInput';
import DiscreetModeToggle from 'src/modules/settings/components/discreetModeToggle';
import { defaultDerivationPath } from 'src/utils/explicitBipKeyDerivation';
import NetworkSelector from 'src/modules/settings/components/networkSelector';
import { getDerivationPathErrorMessage } from 'src/modules/wallet/utils/account';
import styles from './AddAccountForm.css';

const AddAccountForm = ({ settings, onAddAccount }) => {
  const [passphrase, setPass] = useState({ value: '', isValid: false });

  const setPassphrase = (value, error) => {
    setPass({
      value,
      isValid: !error,
    });
  };

  const props = { settings, onAddAccount, setPassphrase, passphrase };

  if (settings.enableAccessToLegacyAccounts) {
    return <AddAccountFormContainer {...props} />;
  }
  return <AddAccountFormWithDerivationPath {...props} />;
};

const AddAccountFormContainer = ({
  settings,
  passphrase,
  setPassphrase,
  onAddAccount,
  isSubmitDisabled,
  derivationPath,
  children,
}) => {
  const { t } = useTranslation();

  const onFormSubmit = (e) => {
    e.preventDefault();
    // istanbul ignore else
    if (passphrase.value && passphrase.isValid) {
      onAddAccount(passphrase, derivationPath);
    }
  };

  const handleKeyPress = (e) => {
    if (e.charCode === 13) onFormSubmit(e);
  };

  const passphraseArray = useMemo(
    () => passphrase.value?.replace(/\W+/g, ' ')?.split(/\s/),
    [passphrase.value]
  );

  return (
    <div className={`${styles.addAccount}`}>
      <div className={`${styles.wrapper} ${grid['col-xs-12']}`}>
        <div className={`${styles.titleHolder} ${grid['col-xs-12']}`}>
          <h1>{t('Add your account')}</h1>
          <p>{t('Enter your secret recovery phrase to manage your account.')}</p>
        </div>
        <form onSubmit={onFormSubmit}>
          <div className={styles.inputFields}>
            {settings.showNetwork && (
              <fieldset>
                <label>{t('Switch network')}</label>
                <NetworkSelector />
              </fieldset>
            )}
            <fieldset>
              <label>{t('Secret recovery phrase (12-24 mnemonic phrases supported)')}</label>
              <PassphraseInput
                inputsLength={passphraseArray?.length > 12 ? 24 : 12}
                maxInputsLength={24}
                onFill={setPassphrase}
                keyPress={handleKeyPress}
                values={passphraseArray}
              />
            </fieldset>
            {children}
            <DiscreetModeToggle className={styles.discreetMode} />
          </div>
          <div className={`${styles.buttonsHolder}`}>
            <PrimaryButton
              className={`${styles.button} login-button`}
              type="submit"
              disabled={!passphrase.isValid || isSubmitDisabled}
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

const AddAccountFormWithDerivationPath = (props) => {
  const [derivationPath, setDerivationPath] = useState(defaultDerivationPath);
  const derivationPathErrorMessage = useMemo(
    () => getDerivationPathErrorMessage(derivationPath),
    [derivationPath]
  );

  const onDerivationPathChange = (value) => {
    setDerivationPath(value);
  };

  return (
    <AddAccountFormContainer
      {...props}
      isSubmitDisabled={!!derivationPathErrorMessage}
      derivationPath={derivationPath}
    >
      <CustomDerivationPath
        onChange={onDerivationPathChange}
        value={derivationPath}
        errorMessage={derivationPathErrorMessage}
      />
    </AddAccountFormContainer>
  );
};

export default AddAccountForm;
