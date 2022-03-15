/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react';
import i18next from 'i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import { routes } from '@constants';
import { parseSearchParams, stringifySearchParams } from '@utils/searchParams';
import { getNetworksList } from '@utils/getNetwork';
import Piwik from '@utils/piwik';
import { PrimaryButton } from '@toolbox/buttons';
import PassphraseInput from '@toolbox/passphraseInput';
import Icon from '@toolbox/icon/index';
import DiscreetModeToggle from '@shared/discreetModeToggle';
import NetworkSelector from './networkSelector';
import RecoveryPhrase from './recoveryPhrase';
import styles from './login.css';

const RegisterTitle = ({ t }) => (
  <div className={`${styles.titleHolder} ${grid['col-xs-10']}`}>
    <h1>
      {t('Sign in with a Passphrase')}
    </h1>
    <p>
      {t('Don’t have a Lisk account yet? ')}
      <Link className={styles.link} to={routes.register.path}>
        {t('Create it now')}
      </Link>
    </p>
  </div>
);

/**
 * Get referer address  and redirect to, after signing in
 * @param {object} history - The history object from react-router
 */
const redirectToReferrer = (history) => {
  const { referrer, ...restParams } = parseSearchParams(history.location.search);
  const route = referrer ? `${referrer}${stringifySearchParams(restParams)}` : routes.dashboard.path;

  history.replace(route);
};

const Login = ({
  t, settings, network, history, account, login,
}) => {
  const [passphrase, setPass] = useState({ value: '', isValid: false });
  const canHWSignIn = true;

  const setPassphrase = (value, error) => {
    setPass({
      value,
      isValid: !error,
    });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    Piwik.trackingEvent('Login', 'button', 'Login submission');
    if (passphrase.value && passphrase.isValid) {
      login({ passphrase: passphrase.value });
    }
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
              {
                settings.showNetwork ? (
                  <fieldset>
                    <label>{t('Network')}</label>
                    <NetworkSelector />
                  </fieldset>
                ) : null
              }
              <fieldset>
                <label>{t('Passphrase')}</label>
                <PassphraseInput
                  inputsLength={12}
                  maxInputsLength={24}
                  onFill={setPassphrase}
                  keyPress={handleKeyPress}
                />
              </fieldset>
              <RecoveryPhrase t={t} />
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
              {
                canHWSignIn
                  ? (
                    <Link
                      className={`${styles.hwLink} signin-hwWallet-button`}
                      to={(routes.hwWallet.path)}
                    >
                      <Icon name="hwWalletIcon" className={styles.hwWalletIcon} />
                      {t('Sign in with a hardware wallet')}
                    </Link>
                  ) : null
              }
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
