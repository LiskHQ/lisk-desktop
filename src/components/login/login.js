/* eslint-disable max-lines */
import React from 'react';
import i18next from 'i18next';

import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import { parseSearchParams } from '../../utils/searchParams';
import { extractAddress } from '../../utils/account';
import { getAutoLogInData, findMatchingLoginNetwork } from '../../utils/login';
import { getNetworksList } from '../../utils/getNetwork';
import networks from '../../constants/networks';
import { PrimaryButton, TertiaryButton } from '../toolbox/buttons/button';
import links from '../../constants/externalLinks';
import Tooltip from '../toolbox/tooltip/tooltip';
import PassphraseInput from '../toolbox/passphraseInput';
import styles from './login.css';
import Piwik from '../../utils/piwik';
import DiscreetModeToggle from '../discreetModeToggle';

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
    const { t } = this.props;

    return (
      <React.Fragment>
        <div className={`${styles.login} ${grid.row}`}>
          <div
            className={`${styles.wrapper} ${grid['col-xs-12']} ${grid['col-md-10']} ${grid['col-lg-8']}`}
          >

            <div className={`${styles.titleHolder} ${grid['col-xs-10']}`}>
              <span className={styles.stepsLabel}>
                {t('Sign in')}
              </span>
              <h1>
                {t('Sign in with a passphrase')}
              </h1>
              <p>
                {t('New to Lisk? ')}
                <Link
                  className={`${styles.link}`}
                  to={routes.register.path}
                >
                  {t('Create an account')}
                </Link>
              </p>
            </div>

            <form onSubmit={this.onFormSubmit}>
              <div className={`${styles.inputsHolder}`}>
                <h2 className={`${styles.inputLabel}`}>
                  {t('Passphrase')}
                  <Tooltip
                    className={`${styles.tooltip}`}
                    title={t('What is a passphrase?')}
                    footer={(
                      <a
                        href={links.whatIsAnPassphrase}
                        tabIndex="-1"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {t('Read more')}
                      </a>
)}
                  >
                    <React.Fragment>
                      <p className={`${styles.tooltipText}`}>
                        {t('A passphrase is a combination of a username and password. You saved your passphrase when registering your Lisk account.')}
                      </p>
                      <p className={`${styles.tooltipText}`}>
                        {t('If you are typing out your passphrase you can use tab or space to go to the next field.')}
                      </p>
                      <p className={`${styles.tooltupText}`}>
                        {t('For longer passphrases, simply paste them in the first input field.')}
                      </p>
                    </React.Fragment>
                  </Tooltip>
                </h2>

                <PassphraseInput
                  inputsLength={12}
                  maxInputsLength={24}
                  onFill={this.checkPassphrase}
                />

                <DiscreetModeToggle
                  className={styles.discreetMode}
                  disabledText={t('Discreet Mode Disabled')}
                  enabledText={t('Discreet Mode Enabled')}
                />
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
                <Link to={routes.splashscreen.path}>
                  <TertiaryButton className={`${styles.button} ${styles.backButton}`}>
                    {t('Go back')}
                  </TertiaryButton>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withTranslation()(Login);
