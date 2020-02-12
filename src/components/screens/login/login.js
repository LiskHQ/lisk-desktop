/* eslint-disable max-lines */
import React from 'react';
import i18next from 'i18next';

import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import routes from '../../../constants/routes';
import { parseSearchParams } from '../../../utils/searchParams';
import { extractAddress } from '../../../utils/account';
import { getAutoLogInData, findMatchingLoginNetwork } from '../../../utils/login';
import { getNetworksList } from '../../../utils/getNetwork';
import networks from '../../../constants/networks';
import { PrimaryButton } from '../../toolbox/buttons/button';
import PassphraseInput from '../../toolbox/passphraseInput';
import Piwik from '../../../utils/piwik';
import DiscreetModeToggle from '../../shared/discreetModeToggle';
import Icon from '../../toolbox/icon/index';
import styles from './login.css';

class Login extends React.Component {
  constructor() { // eslint-disable-line max-statements
    super();
    const { liskCoreUrl } = getAutoLogInData();
    let loginNetwork = findMatchingLoginNetwork();
    let address = '';

    if (loginNetwork) {
      loginNetwork = loginNetwork.slice(-1).shift();
    } else if (!loginNetwork) {
      loginNetwork = liskCoreUrl ? networks.customNode : networks.default;
      address = liskCoreUrl || '';
    }

    this.state = {
      isValid: false,
      passphrase: '',
      network: loginNetwork.name,
      address,
      validationError: false,
    };

    this.secondIteration = false;

    this.networks = getNetworksList();

    this.checkPassphrase = this.checkPassphrase.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onLoginSubmission = this.onLoginSubmission.bind(this);
  }

  async componentDidMount() {
    // istanbul ignore else
    if (!this.props.settings.areTermsOfUseAccepted) {
      this.props.history.push(routes.termsOfUse.path);
    }

    i18next.on('languageChanged', getNetworksList);
  }

  componentDidUpdate(prevProps) {
    const params = parseSearchParams(prevProps.history.location.search);
    const showNetworkParam = params.showNetwork
      || params.shownetwork
      || (this.props.settings && this.props.settings.showNetwork);

    if (this.props.account
      && this.props.account.address && (showNetworkParam !== 'true' || this.secondIteration)
      && !this.alreadyLoggedWithThisAddress(prevProps.account.address, prevProps.network)) {
      this.redirectToReferrer();
    }
  }

  getReferrerRoute() {
    const search = parseSearchParams(this.props.history.location.search);
    const dashboardRoute = `${routes.dashboard.path}`;
    const referrerRoute = search.referrer ? search.referrer : dashboardRoute;
    return referrerRoute;
  }

  redirectToReferrer() {
    const tem = this.getReferrerRoute();
    this.props.history.replace(tem);
  }

  alreadyLoggedWithThisAddress(address, prevNetwork) {
    const { account, network, settings: { token: { active } } } = this.props;
    return account
      && network
      && account.address === address
      && network.name === prevNetwork.name
      && network.networks[active].nodeUrl === prevNetwork.networks[active].nodeUrl;
  }

  checkPassphrase(passphrase, validationError) {
    this.setState({
      passphrase,
      isValid: !validationError,
    });
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.onLoginSubmission(this.state.passphrase);
  }

  onLoginSubmission(passphrase) {
    Piwik.trackingEvent('Login', 'button', 'Login submission');
    const { network, login } = this.props;
    this.secondIteration = true;
    if (this.alreadyLoggedWithThisAddress(extractAddress(passphrase), network)) {
      this.redirectToReferrer();
    } else {
      login({ passphrase });
    }
  }

  // eslint-disable-next-line complexity
  render() {
    const { t, network } = this.props;
    const canHWSignIn = !network.networks.LSK || network.networks.LSK.apiVersion === '2';

    return (
      <React.Fragment>
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

            <form onSubmit={this.onFormSubmit}>
              <div className={`${styles.inputsHolder}`}>
                <label className={styles.inputLabel}>{t('Passphrase')}</label>
                <p className={styles.inputText}>{t('Please type in or paste your passphrase below.')}</p>

                <PassphraseInput
                  inputsLength={12}
                  maxInputsLength={24}
                  onFill={this.checkPassphrase}
                />

                <DiscreetModeToggle className={styles.discreetMode} />
              </div>
              <div className={`${styles.buttonsHolder}`}>
                <PrimaryButton
                  className={`${styles.button} login-button`}
                  type="submit"
                  disabled={(this.state.network === networks.customNode.name
                    && !!this.state.addressValidity)
                    || !this.state.isValid
                    || this.state.passphrase === ''}
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

            <p className={styles.exploreAsGuest}>
              {t('Don’t feel like signing in now?')}
              <Link className={`${styles.link} explore-as-guest-button`} to={routes.dashboard.path}>
                {t('Explore as a guest')}
              </Link>
            </p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withTranslation()(Login);
