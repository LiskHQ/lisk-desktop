/* eslint-disable max-lines */
import React from 'react';
import i18next from 'i18next';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import { routes, networks, networkKeys } from '@constants';
import { parseSearchParams, stringifySearchParams } from '@utils/searchParams';
import { extractAddressFromPassphrase } from '@utils/account';
import { getAutoLogInData, findMatchingLoginNetwork } from '@utils/login';
import { getNetworksList } from '@utils/getNetwork';
import Piwik from '@utils/piwik';
import { PrimaryButton } from '@toolbox/buttons';
import PassphraseInput from '@toolbox/passphraseInput';
import CheckBox from '@toolbox/checkBox';
import { Input } from '@toolbox/inputs';
import DiscreetModeToggle from '@shared/discreetModeToggle';
import { defaultDerivationPath } from '@utils/explicitBipKeyDerivation';
// import Icon from '@toolbox/icon/index';
import NetworkSelector from './networkSelector';
import styles from './login.css';

class Login extends React.Component {
  constructor() { // eslint-disable-line max-statements
    super();
    const { liskServiceUrl } = getAutoLogInData();
    let loginNetwork = findMatchingLoginNetwork();
    let address = '';

    if (!loginNetwork) {
      loginNetwork = liskServiceUrl ? networks.customNode : networks[networkKeys.mainNet];
      address = liskServiceUrl || '';
    }

    this.state = {
      isValid: false,
      passphrase: '',
      network: loginNetwork.name,
      address,
      validationError: false,
      isRecoveryPhraseMode: false,
      showCustomDerivationPath: false,
      derivationPath: defaultDerivationPath,
    };

    this.secondIteration = false;

    this.networks = getNetworksList();

    this.checkPassphrase = this.checkPassphrase.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onLoginSubmission = this.onLoginSubmission.bind(this);
    this.toogleRecoveryPhraseMode = this.toogleRecoveryPhraseMode.bind(this);
    this.toogleCustomDerivationPath = this.toogleCustomDerivationPath.bind(this);
    this.onChangeDerivationPath = this.onChangeDerivationPath.bind(this);
  }

  async componentDidMount() {
    // istanbul ignore else
    if (!this.props.settings.areTermsOfUseAccepted && this.props.network.networks?.LSK) {
      this.props.history.push(routes.termsOfUse.path);
    }

    i18next.on('languageChanged', getNetworksList);
  }

  componentDidUpdate() {
    if (this.props.account?.summary?.address) {
      this.redirectToReferrer();
    }
  }

  getReferrerRoute() {
    const { referrer, ...restParams } = parseSearchParams(this.props.history.location.search);
    const route = referrer ? `${referrer}${stringifySearchParams(restParams)}` : routes.dashboard.path;
    return route;
  }

  redirectToReferrer() {
    this.props.history.replace(this.getReferrerRoute());
  }

  alreadyLoggedWithThisAddress(address, prevNetwork) {
    const { account, network, settings: { token: { active } } } = this.props;
    return account
      && network
      && account.summary?.address === address
      && network.name === prevNetwork.name
      && network.networks[active].nodeUrl === prevNetwork.networks[active].nodeUrl;
  }

  checkPassphrase(passphrase, validationError) {
    this.setState({
      passphrase,
      isValid: !validationError,
    });
  }

  toogleRecoveryPhraseMode(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      isRecoveryPhraseMode: !this.state.isRecoveryPhraseMode,
    });
  }

  toogleCustomDerivationPath(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      showCustomDerivationPath: !this.state.showCustomDerivationPath,
    });
  }

  onChangeDerivationPath(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      derivationPath: e.target.value,
    });
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.onLoginSubmission(this.state.passphrase);
  }

  onLoginSubmission(passphrase) {
    Piwik.trackingEvent('Login', 'button', 'Login submission');
    const { network, login } = this.props;
    const { isRecoveryPhraseMode, derivationPath } = this.state;
    this.secondIteration = true;

    if (this.alreadyLoggedWithThisAddress(extractAddressFromPassphrase(passphrase), network)) {
      this.redirectToReferrer();
    } else {
      login({ passphrase, isRecoveryPhraseMode, derivationPath });
    }
  }

  // eslint-disable-next-line complexity
  render() {
    const { t, settings } = this.props;
    // const canHWSignIn = !network.networks?.LSK;

    return (
      <>
        <div className={`${styles.login} ${grid.row}`}>
          <div
            className={`${styles.wrapper} ${grid['col-xs-12']} ${grid['col-md-10']} ${grid['col-lg-8']}`}
          >
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

            <form onSubmit={e => e.preventDefault()}>
              {
                settings.showNetwork ? (
                  <fieldset className={`${styles.inputsHolder}`}>
                    <label>{t('Network')}</label>
                    <NetworkSelector />
                  </fieldset>
                ) : null
              }
              <fieldset className={`${styles.inputsHolder}`}>
                <label className={styles.inputLabel}>{t('Passphrase')}</label>
                <PassphraseInput
                  inputsLength={12}
                  maxInputsLength={24}
                  onFill={this.checkPassphrase}
                />
                <DiscreetModeToggle className={styles.discreetMode} />
              </fieldset>
              <fieldset className={`${styles.inputsHolder}`}>
                <label className={styles.inputLabel}>
                  <CheckBox
                    name="recoveryMode"
                    className={``}
                    checked={this.state.isRecoveryPhraseMode}
                    onChange={this.toogleRecoveryPhraseMode}
                  />
                  {t('Enable recovery phrase mode (optional)')}
                </label>
                <label className={styles.inputLabel}>
                  <CheckBox
                    name="customDerivation"
                    className={``}
                    checked={this.state.showCustomDerivationPath}
                    onChange={this.toogleCustomDerivationPath}
                  />
                  {t('Modify derivation path (optional)')}
                </label>
                {this.state.showCustomDerivationPath && (
                  <Input
                    className={``}
                    size="l"
                    onChange={this.onChangeDerivationPath}
                    value={this.state.derivationPath}
                  />
                )}
              </fieldset>
              <div className={`${styles.buttonsHolder}`}>
                <PrimaryButton
                  onClick={this.onFormSubmit}
                  className={`${styles.button} login-button`}
                  type="submit"
                  disabled={(this.state.network === networks.customNode.name
                    && !!this.state.addressValidity)
                    || !this.state.isValid
                    || this.state.passphrase === ''}
                >
                  {t('Sign in')}
                </PrimaryButton>
                {/* {
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
                } */}

              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(Login);
