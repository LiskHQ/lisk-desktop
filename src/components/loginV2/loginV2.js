/* eslint-disable max-lines */
import React from 'react';
import i18next from 'i18next';
import Lisk from 'lisk-elements';

import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import { parseSearchParams } from './../../utils/searchParams';
import { extractAddress } from '../../utils/account';
import { validateUrl, addHttp, getAutoLogInData, findMatchingLoginNetwork } from '../../utils/login';
import getNetwork from '../../utils/getNetwork';
import networks from '../../constants/networks';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import links from '../../constants/externalLinks';
import feedbackLinks from '../../constants/feedbackLinks';
import Tooltip from '../toolbox/tooltip/tooltip';
import HeaderV2 from '../headerV2/headerV2';
import { InputV2 } from '../toolbox/inputsV2';
import PassphraseInputV2 from '../passphraseInputV2/passphraseInputV2';
import Feedback from '../toolbox/feedback/feedback';
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
      devices: [],
    };

    this.secondIteration = false;

    this.getNetworksList();

    this.checkPassphrase = this.checkPassphrase.bind(this);
    this.changeNetwork = this.changeNetwork.bind(this);
    this.changeAddress = this.changeAddress.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onLoginSubmission = this.onLoginSubmission.bind(this);
    this.validateCorrectNode = this.validateCorrectNode.bind(this);
  }

  async componentDidMount() {
    // istanbul ignore else
    if (!this.props.settings.areTermsOfUseAccepted) {
      this.props.history.push(routes.termsOfUse.path);
    }

    this.setState({
      devices: await getDeviceList(),
    });

    i18next.on('languageChanged', this.getNetworksList);
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

  getNetworksList() {
    this.networks = Object.keys(networks)
      .filter(network => network !== 'default')
      .map((network, index) => ({
        label: i18next.t(networks[network].name),
        value: index,
      }));
  }

  // eslint-disable-next-line class-methods-use-this
  showNetworkOptions() {
    const showNetwork = this.props.settings && this.props.settings.showNetwork;
    const params = parseSearchParams(this.props.history.location.search);
    const showNetworkParam = params.showNetwork || params.shownetwork;

    return showNetworkParam === 'true' || (showNetwork && showNetworkParam !== 'false');
  }

  checkPassphrase(passphrase, validationError) {
    this.setState({
      passphrase,
      isValid: !validationError,
    });
  }

  changeAddress({ target }) {
    const address = target.value;
    this.setState({
      address,
      ...validateUrl(address),
    });
  }

  changeNetwork(network) {
    this.setState({ network });
    this.props.settingsUpdated({ network });
  }

  getNetwork(chosenNetwork) {
    const network = { ...getNetwork(chosenNetwork) };
    if (chosenNetwork === networks.customNode.code) {
      network.address = addHttp(this.state.address);
    }
    return network;
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.onLoginSubmission(this.state.passphrase);
  }

  onLoginSubmission(passphrase) {
    Piwik.trackingEvent('Login V2', 'button', 'Login submission');
    const network = this.getNetwork(this.state.network);
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

  validateCorrectNode(nextPath) {
    const { address } = this.state;
    const nodeURL = address !== '' ? addHttp(address) : address;
    if (this.state.network === networks.customNode.code) {
      const liskAPIClient = new Lisk.APIClient([nodeURL], {});
      liskAPIClient.node.getConstants()
        .then((res) => {
          if (res.data) {
            this.props.liskAPIClientSet({
              network: {
                ...this.getNetwork(this.state.network),
                address: nodeURL,
              },
            });
            this.props.history.push(nextPath);
          } else {
            throw new Error();
          }
        }).catch(() => {
          this.props.errorToastDisplayed({ label: i18next.t('Unable to connect to the node') });
        });
    } else {
      const network = this.getNetwork(this.state.network);
      this.props.liskAPIClientSet({ network });
      this.props.history.push(nextPath);
    }
  }

  // eslint-disable-next-line complexity
  render() {
    const { t, match } = this.props;

    return (
      <React.Fragment>
        { match.url === routes.loginV2.path ? (
        <HeaderV2
          networkList={this.networks}
          selectedNetwork={this.state.network}
          handleNetworkSelect={this.changeNetwork}
          showSettings={true}
          showNetwork={this.showNetworkOptions()} />
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
                <div className={`${styles.customNode} ${this.state.network === networks.customNode.code ? styles.showInput : ''}`}>
                  <h2 className={`${styles.inputLabel}`}>{t('IP or domain address of a node')}</h2>
                  <div className={`${styles.addressInput} address`}>
                    <InputV2
                      className={`${this.state.addressValidity ? 'error' : ''}`}
                      type="text"
                      value={this.state.address}
                      onChange={this.changeAddress} />
                    <Feedback
                      show={!!this.state.addressValidity}
                      status={this.state.addressValidity ? 'error' : ''}
                      showIcon={true}>
                      { this.state.addressValidity }
                    </Feedback>
                  </div>
                </div>

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

                  <div className={`${styles.hardwareHolder}
                    ${(localStorage.getItem('trezor') && this.state.devices.length > 0)
                    ? styles.show : ''}`}>
                    <div className={`${styles.label}`}>
                      {t('Hardware login (beta): ')}
                      <span className={`${styles.link} hardwareWalletLink`}
                        onClick={() => this.validateCorrectNode(routes.hwWallet.path)}>
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
                  </div>
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
