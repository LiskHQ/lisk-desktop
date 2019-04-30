/* eslint-disable max-lines */
import React from 'react';
import i18next from 'i18next';

import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import { parseSearchParams } from './../../utils/searchParams';
import { extractAddress } from '../../utils/account';
import { getAutoLogInData, findMatchingLoginNetwork } from '../../utils/login';
import { getNetworksList } from '../../utils/getNetwork';
import networks from '../../constants/networks';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import links from '../../constants/externalLinks';
import feedbackLinks from '../../constants/feedbackLinks';
import Tooltip from '../toolbox/tooltip/tooltip';
import HeaderV2 from '../headerV2/index';
import PassphraseInputV2 from '../passphraseInputV2/passphraseInputV2';
import styles from './loginV2.css';
import Piwik from '../../utils/piwik';
import { getDeviceList } from '../../utils/hwWallet';

class LoginV2 extends React.Component {
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
      network: loginNetwork.code,
      address,
      validationError: false,
      devices: [],
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

    this.setState({
      devices: await getDeviceList(),
    });

    i18next.on('languageChanged', getNetworksList);
  }

  componentDidUpdate(prevProps) {
    const params = parseSearchParams(prevProps.history.location.search);
    const showNetworkParam = params.showNetwork
      || params.shownetwork
      || (this.props.settings && this.props.settings.showNetwork);

    if (this.props.account &&
      this.props.account.address && (showNetworkParam !== 'true' || this.secondIteration) &&
      !this.alreadyLoggedWithThisAddress(prevProps.account.address, prevProps.peers.options)) {
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

  alreadyLoggedWithThisAddress(address, network) {
    return this.props.account &&
      this.props.peers.options &&
      this.props.account.address === address &&
      this.props.peers.options.code === network.code &&
      this.props.peers.options.address === network.address;
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
    Piwik.trackingEvent('Login V2', 'button', 'Login submission');
    const network = this.props.peers.options;
    this.secondIteration = true;
    if (this.alreadyLoggedWithThisAddress(extractAddress(passphrase), network)) {
      this.redirectToReferrer();
    } else {
      this.props.liskAPIClientSet({
        passphrase,
        network,
      });
    }
  }

  // eslint-disable-next-line complexity
  render() {
    const { t, match } = this.props;

    return (
      <React.Fragment>
        { match.url === routes.loginV2.path ? (
        <HeaderV2 showSettings={true} />
        ) : null }
        <div className={`${styles.login} ${grid.row}`}>
          <div
            className={`${styles.wrapper} ${grid['col-xs-12']} ${grid['col-md-10']} ${grid['col-lg-8']}`}>

            <div className={`${styles.titleHolder} ${grid['col-xs-10']}`}>
              <span className={styles.stepsLabel}>
                {t('Sign in')}
              </span>
              <h1>
                {t('Sign in with a Passphrase')}
              </h1>
              <p>
                {t('New to Lisk? ')}
                <Link className={`${styles.link}`}
                  to={routes.registerV2.path}>
                  {t('Create an Account')}
                </Link>
              </p>
            </div>

            <form onSubmit={this.onFormSubmit}>
              <div className={`${styles.inputsHolder}`}>
                <h2 className={`${styles.inputLabel}`}>
                  {t('Passphrase')}
                  <Tooltip
                    className={`${styles.tooltip}`}
                    title={t('What is your passphrase?')}
                    footer={
                      <a href={links.whatIsAnPassphrase}
                        tabIndex={'-1'}
                        rel="noopener noreferrer"
                        target="_blank">
                          {t('Read More')}
                      </a>}>
                    <React.Fragment>
                      <p className={`${styles.tooltipText}`}>
                        {t('Your passphrase is both your login and passphrase to your Lisk Hub. It is provided during account registration.')}
                      </p>
                      <p className={`${styles.tooltipText}`}>
                        {t('You can use tab or space to go to the next field.')}
                      </p>
                      <p className={`${styles.tooltupText}`}>
                        {t('For longer passphrases, simply paste it in the first input field.')}
                      </p>
                    </React.Fragment>
                  </Tooltip>
                </h2>

                <PassphraseInputV2
                  inputsLength={12}
                  maxInputsLength={24}
                  onFill={this.checkPassphrase} />

                  {localStorage.getItem('trezor') ?
                    <div className={`${styles.hardwareHolder}
                      ${this.state.devices.length > 0 ? styles.show : ''}`}>
                      <div className={`${styles.label}`}>
                        {t('Hardware login (beta): ')}
                        <span className={`${styles.link} hardwareWalletLink`}
                          onClick={() => this.props.history.push(routes.hwWallet.path)}>
                          {this.state.devices[0] && this.state.devices[0].model}
                        </span>
                      </div>
                      <a
                        className={styles.link}
                        target='_blank'
                        href={feedbackLinks.ledger}
                        rel='noopener noreferrer'>
                        {t('Give feedback about this feature')}
                      </a>
                    </div> :
                    <div className={`${styles.hardwareHolder} ${(this.props.settings && this.props.settings.isHarwareWalletConnected) ? styles.show : ''}`}>
                      <div className={`${styles.label}`}>
                        {t('Hardware login (beta): ')}
                        <span className={`${styles.link} hardwareWalletLink`}
                          onClick={() => this.validateCorrectNode(routes.hwWallet.path)}>
                          Ledger Nano S
                        </span>
                      </div>
                      <a
                        className={styles.link}
                        target='_blank'
                        href={feedbackLinks.ledger}
                        rel='noopener noreferrer'>
                        {t('Give feedback about this feature')}
                      </a>
                    </div>
                  }
              </div>

              <div className={`${styles.buttonsHolder}`}>
                <PrimaryButtonV2
                  className={`${styles.button} login-button`}
                  type='submit'
                  disabled={(this.state.network === networks.customNode.code
                    && !!this.state.addressValidity)
                    || !this.state.isValid
                    || this.state.passphrase === ''}>
                  {t('Sign In')}
                </PrimaryButtonV2>
                <Link to={routes.splashscreen.path}>
                  <TertiaryButtonV2 className={`${styles.button} ${styles.backButton}`}>
                    {t('Go Back')}
                  </TertiaryButtonV2>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(LoginV2);
