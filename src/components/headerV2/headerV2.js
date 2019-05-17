import React from 'react';
import Lisk from 'lisk-elements';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { SecondaryButtonV2, PrimaryButtonV2 } from '../toolbox/buttons/button';
import Feedback from '../toolbox/feedback/feedback';
import { InputV2 } from '../toolbox/inputsV2';
import { addHttp, getAutoLogInData, findMatchingLoginNetwork } from '../../utils/login';
import getNetwork, { getNetworksList } from '../../utils/getNetwork';
import { parseSearchParams } from './../../utils/searchParams';

import darkLogo from '../../assets/images/logo/lisk-logo-dark.svg';
import whiteLogo from '../../assets/images/logo/lisk-logo-white.svg';
import routes from '../../constants/routes';
import networks from '../../constants/networks';
import styles from './headerV2.css';
import autoSuggestInputStyles from '../autoSuggestV2/autoSuggest.css';
import formStyles from '../sendV2/form/form.css';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';
import SpinnerV2 from '../spinnerV2/spinnerV2';
import svg from '../../utils/svgIcons';

class HeaderV2 extends React.Component {
  // eslint-disable-next-line max-statements
  constructor() {
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
      address,
      showDropdown: false,
      network: loginNetwork.code,
      isFirstTime: true,
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  showNetworkOptions() {
    const showNetwork = this.props.settings && this.props.settings.showNetwork;
    const params = parseSearchParams(this.props.history.location.search);
    const showNetworkParam = params.showNetwork || params.shownetwork;

    return showNetworkParam === 'true' || (showNetwork && showNetworkParam !== 'false');
  }

  changeAddress({ target }) {
    const address = target.value;
    this.setState({
      address,
      isFirstTime: true,
      connected: false,
    });
  }

  changeNetwork(network) {
    this.setState({
      network,
      address: network === networks.mainnet.code || network === networks.testnet.code ?
        '' : this.state.address,
    });
    this.props.settingsUpdated({ network });
  }

  getNetwork(chosenNetwork) {
    const network = { ...getNetwork(chosenNetwork) };
    if (chosenNetwork === networks.customNode.code) {
      network.address = addHttp(this.state.address);
    }
    return network;
  }

  /* istanbul ignore next */
  validateCorrectNode(network, address, nextPath) {
    const nodeURL = address !== '' ? addHttp(address) : address;

    if (network === networks.customNode.code) {
      const liskAPIClient = new Lisk.APIClient([nodeURL], {});
      liskAPIClient.node.getConstants()
        .then((res) => {
          if (res.data) {
            this.props.liskAPIClientSet({
              network: {
                ...this.getNetwork(network),
                address: nodeURL,
              },
            });

            this.props.history.push(nextPath);
            this.setState({ validationError: false, connected: true });
            this.toggleDropdown(false);
          } else {
            throw new Error();
          }
        }).catch(() => {
          this.setState({ validationError: true });
        });
      this.setState({ isValidationLoading: false, isFirstTime: false });
    } else {
      this.props.liskAPIClientSet({ network: this.getNetwork(network) });
      this.props.history.push(nextPath);
      this.setState({ validationError: false });
    }

    this.setState({ network });
  }

  toggleDropdown(value) {
    if ((!value && this.state.network !== networks.customNode.code)
      || this.state.validationError) {
      this.setState({ address: '', validationError: false, connected: false });
    }
    this.setState({ showDropdown: value });
  }
  /* istanbul ignore next */
  /* eslint-disable complexity */
  render() {
    const {
      t, showSettings, showNetwork,
      dark, selectedNetwork, address,
    } = this.props;
    const showNetwork = showNetwork || this.showNetworkOptions();
    const networkList = getNetworksList();

    return (
      <header className={`${styles.wrapper} mainHeader ${dark ? 'dark' : ''}`}>
        <div className={`${styles.headerContent}`}>
          <div className={`${styles.logo}`}>
            <img src={dark ? whiteLogo : darkLogo} />
          </div>
          <div className={`${styles.buttonsHolder}`}>
            {showNetwork &&
              <div>
                <span className={`${this.state.validationError ? styles.dropdownError : ''} ${styles.dropdownHandler} network`}
                      onClick={() => this.toggleDropdown(!this.state.showDropdown)}>
                      { selectedNetwork !== networks.customNode.code
                        ? networkList[selectedNetwork].label
                        : address || this.state.address }</span>
                <DropdownV2
                  className={`${styles.dropdown} ${dark ? 'dark' : ''} network-dropdown`}
                  showArrow={false}
                  showDropdown={this.state.showDropdown}
                  active={selectedNetwork}>
                  {networkList && networkList.map((network, key) => {
                    const activeTab = this.state.network === networks.customNode.code;
                    if (network.value === networks.customNode.code) {
                      return <span
                      className={`${styles.networkSpan} address`}
                      key={key}
                      onClick={() => {
                        this.changeNetwork(network.value);
                      }}>
                        {network.label}
                          <InputV2
                            autoComplete={'off'}
                            onChange={(value) => {
                              this.changeAddress(value);
                            }}
                            name='customNetwork'
                            value={this.state.address}
                            placeholder={this.props.t('ie. 192.168.0.1')}
                            className={`
                              custom-network
                              ${formStyles.input}
                              ${autoSuggestInputStyles.input}
                              ${this.state.validationError ? styles.errorInput : ''}`} />
                          <div className={styles.icons}>
                            <SpinnerV2 className={`${styles.spinner} ${this.state.isValidationLoading && this.state.address ? styles.show : styles.hide}`}/>
                            <img
                              className={`${styles.status} ${!this.state.isValidationLoading && this.state.address && !this.state.isFirstTime
                                ? styles.show : styles.hide}`}
                              src={ !this.state.connected ? svg.iconWarning : svg.ok_icon}
                            />
                          </div>
                          {activeTab ?
                            <Feedback
                              show={this.state.validationError}
                              status={'error'}
                              className={`${this.state.validationError ? styles.feedbackError : ''} ${styles.feedbackMessage} amount-feedback`}
                              showIcon={false}
                              dark={dark}>
  {t('Unable to connect to the node, please check the address and try again')}
                            </Feedback> : ''}
                          {activeTab ?
                            <div>
                              <PrimaryButtonV2
                                disabled={this.state.connected}
                                /* istanbul ignore next */
                                onClick={(e) => {
                                    e.stopPropagation();

                                    this.setState({ isValidationLoading: true });
                                    this.loaderTimeout = setTimeout(() => {
                                      this.validateCorrectNode(
                                        networks.customNode.code,
                                        this.state.address,
                                      );
                                      this.changeNetwork(networks.customNode.code);
                                    }, 300);
                                }}
                                className={`${styles.button} ${styles.backButton} connect-button`}>
                                {this.state.connected ? t('Connected') : t('Connect')}
                              </PrimaryButtonV2>
                            </div> : ''}
                      </span>;
                    }

                    return (
                      <span
                        onClick={() => {
                          this.changeNetwork(network.value);
                          this.validateCorrectNode(network.value);
                          this.toggleDropdown(false);
                          this.setState({ connected: false, isFirstTime: true });
                        }}
                        key={key}>{network.label}
                      </span>
                    );
                  })}
                </DropdownV2>
              </div>
            }
            {showSettings
              && <Link className={styles.settingButton} to={routes.setting.path}>
                <SecondaryButtonV2 className={`${dark ? 'light' : ''}`}>
                  {t('Settings')}
                </SecondaryButtonV2>
              </Link>
            }
          </div>
        </div>
      </header>
    );
  }
}

export default translate()(withRouter(HeaderV2));
