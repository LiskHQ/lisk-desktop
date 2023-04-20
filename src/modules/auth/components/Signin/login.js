/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react';
import i18next from 'i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from 'src/routes/routes';
import { parseSearchParams, stringifySearchParams } from 'src/utils/searchParams';
import { getNetworksList } from '@network/utils/getNetwork';
import Piwik from 'src/utils/piwik';
import { PrimaryButton } from 'src/theme/buttons';
import PassphraseInput from 'src/modules/wallet/components/PassphraseInput/PassphraseInput';
import DiscreetModeToggle from 'src/modules/settings/components/discreetModeToggle';
import NetworkSelector from 'src/modules/settings/components/networkSelector';
import CustomDerivationPath from '../CustomDerivationPath';
import styles from './login.css';

const RegisterTitle = ({ t }) => (
  <div className={`${styles.titleHolder} ${grid['col-xs-10']}`}>
    <h1>{t('Add your account')}</h1>
    <p>{t('Enter your secret recovery phrase to manage your account.')}</p>
  </div>
);

/**
 * Get referer address  and redirect to, after signing in
 * @param {object} history - The history object from react-router
 */
const redirectToReferrer = (history) => {
  const { referrer, ...restParams } = parseSearchParams(history.location.search);
  const route = referrer ? `${referrer}${stringifySearchParams(restParams)}` : routes.wallet.path;

  history.replace(route);
};

const Login = ({ t, settings, network, history, account }) => {
  const [passphrase, setPass] = useState({ value: '', isValid: false });

  const setPassphrase = (value, error) => {
    setPass({
      value,
      isValid: !error,
    });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    Piwik.trackingEvent('Login', 'button', 'Login submission');
  };

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      onFormSubmit(e);
    }
  };

  useEffect(() => {
    // istanbul ignore else
    if (!settings.areTermsOfUseAccepted && network.networks?.LSK) {
      history.push(routes.termsOfUse.path);
    }

    i18next.on('languageChanged', getNetworksList);
  }, []);

  useEffect(() => {
    if (account?.summary?.address) {
      redirectToReferrer(history);
    }
  }, [account?.summary?.address]);

  return (
    <>
      <div className={`${styles.login} ${grid.row}`}>
        <div
          className={`${styles.wrapper} ${grid['col-xs-12']} ${grid['col-md-10']} ${grid['col-lg-8']}`}
        >
          <RegisterTitle t={t} />
          <form onSubmit={onFormSubmit}>
            <div className={styles.inputFields}>
              {settings.showNetwork ? (
                <fieldset>
                  <label>{t('Network')}</label>
                  <NetworkSelector />
                </fieldset>
              ) : null}
              <fieldset>
                <label>{t('Secret recovery phrase')}</label>
                <PassphraseInput
                  inputsLength={12}
                  maxInputsLength={24}
                  onFill={setPassphrase}
                  keyPress={handleKeyPress}
                />
              </fieldset>
              <CustomDerivationPath t={t} />
              <DiscreetModeToggle className={styles.discreetMode} />
            </div>
            <div className={`${styles.buttonsHolder}`}>
              <PrimaryButton
                className={`${styles.button} login-button`}
                type="submit"
                disabled={!passphrase.isValid}
              >
                {t('Sign in')}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
