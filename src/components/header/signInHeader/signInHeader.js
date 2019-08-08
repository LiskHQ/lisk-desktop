/* eslint-disable max-lines */
import React from 'react';
import Lisk from '@liskhq/lisk-client';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { PrimaryButton } from '../../toolbox/buttons/button';
import Feedback from '../../toolbox/feedback/feedback';
import { Input } from '../../toolbox/inputs';
import { addHttp, getAutoLogInData, findMatchingLoginNetwork } from '../../../utils/login';
import getNetwork, { getNetworksList } from '../../../utils/getNetwork';
import { parseSearchParams } from '../../../utils/searchParams';
import Icon from '../../toolbox/icon';
import UserAccount from '../../topBar/accountMenu/userAccount';
import networks from '../../../constants/networks';
import styles from './signInHeader.css';
import formStyles from '../../send/form/form.css';
import Dropdown from '../../toolbox/dropdown/dropdown';
import Spinner from '../../spinner/spinner';
import keyCodes from '../../../constants/keyCodes';
import svg from '../../../utils/svgIcons';

class Header extends React.Component {
  // eslint-disable-next-line max-statements
  constructor(props) {
    super(props);
    const { liskCoreUrl } = getAutoLogInData();
    let loginNetwork = findMatchingLoginNetwork();
    let address = '';

    if (loginNetwork) loginNetwork = loginNetwork.slice(-1).shift();
    if (!loginNetwork) {
      loginNetwork = liskCoreUrl ? networks.customNode : networks.default;
      address = liskCoreUrl || props.address;
    }

    this.state = {
      address,
      showDropdown: false,
      showSettingDrowdown: false,
      network: loginNetwork.code,
      isFirstTime: true,
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleSettingsToggle = this.handleSettingsToggle.bind(this);
    this.onConnectToCustomNode = this.onConnectToCustomNode.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { address } = this.props;
    if (address !== prevProps.address) this.setState({ address });
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
      address: network === networks.mainnet.code || network === networks.testnet.code
        ? '' : this.state.address,
    });
    const { name, address } = this.getNetwork(network);
    if (address !== 'http://') {
      this.props.settingsUpdated({ network: { name, address } });
    }
  }

  getNetwork(chosenNetwork) {
    const network = { ...getNetwork(getNetworksList()[chosenNetwork].label) };
    if (chosenNetwork === networks.customNode.code) {
      network.address = addHttp(this.state.address);
    }
    return network;
  }

  /* istanbul ignore next */
  // eslint-disable-next-line max-statements
  validateCorrectNode(network, address, nextPath) {
    const nodeURL = address !== '' ? addHttp(address) : '';
    const newNetwork = this.getNetwork(network);

    if (network === networks.customNode.code) {
      const liskAPIClient = new Lisk.APIClient([nodeURL], {});
      liskAPIClient.node.getConstants()
        .then((res) => {
          if (res.data) {
            this.props.networkSet({
              name: newNetwork.name,
              network: {
                ...newNetwork,
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
      this.props.networkSet({
        name: newNetwork.name,
        network: {
          ...newNetwork,
        },
      });
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

  handleSettingsToggle() {
    this.setState({ showSettingDrowdown: !this.state.showSettingDrowdown });
  }

  onConnectToCustomNode(e) {
    e.stopPropagation();
    this.setState({ isValidationLoading: true });
    this.validateCorrectNode(networks.customNode.code, this.state.address);
    this.changeNetwork(networks.customNode.code);
  }

  /* istanbul ignore next */
  /* eslint-disable complexity */
  render() {
    const {
      account,
      address,
      dark,
      hideNetwork = false,
      selectedNetwork,
      settings,
      settingsUpdated,
      t,
    } = this.props;
    const { showSettingDrowdown } = this.state;
    const showNetworkOptions = !hideNetwork && this.showNetworkOptions();
    const networkList = getNetworksList();
    const isUserLogout = !!(Object.keys(account).length === 0 || account.afterLogout);

    return (
      <header className={`${styles.wrapper} mainHeader ${dark ? 'dark' : ''}`}>
        <div className={`${styles.headerContent}`}>
          <div className={`${styles.logo}`}>
            <Icon name={dark ? 'liskLogoWhite' : 'liskLogo'} className="topbar-logo" />
          </div>
          <div className={`${styles.buttonsHolder}`}>
            {showNetworkOptions
              && (
              <div>
                <span
                  className={`${this.state.validationError ? styles.dropdownError : ''} ${styles.dropdownHandler} network`}
                  onClick={() => this.toggleDropdown(!this.state.showDropdown)}
                >
                  {
                    selectedNetwork !== networks.customNode.code
                      ? networkList[selectedNetwork].label
                      : address || this.state.address
                  }
                </span>
                <Dropdown
                  className={`${styles.dropdown} ${dark ? 'dark' : ''} network-dropdown`}
                  showArrow={false}
                  showDropdown={this.state.showDropdown}
                  active={selectedNetwork}
                >
                  {
                    networkList && networkList.map((network, key) => {
                      const activeTab = this.state.network === networks.customNode.code;
                      if (network.value === networks.customNode.code) {
                        return (
                          <span
                            className={`${styles.networkSpan} address`}
                            key={key}
                            onClick={() => {
                              this.changeNetwork(network.value);
                            }}
                          >
                            {network.label}
                            <Input
                              autoComplete="off"
                              onChange={(value) => { this.changeAddress(value); }}
                              name="customNetwork"
                              value={this.state.address}
                              placeholder={this.props.t('ie. 192.168.0.1')}
                              size="s"
                              className={`custom-network ${formStyles.input} ${this.state.validationError ? styles.errorInput : ''}`}
                              onKeyDown={e => e.keyCode === keyCodes.enter
                                && this.onConnectToCustomNode(e)}
                            />
                            <div className={styles.icons}>
                              <Spinner className={`${styles.spinner} ${this.state.isValidationLoading && this.state.address ? styles.show : styles.hide}`} />
                              <img
                                className={`${styles.status} ${!this.state.isValidationLoading && this.state.address && !this.state.isFirstTime
                                  ? styles.show : styles.hide}`}
                                src={!this.state.connected ? svg.iconWarning : svg.ok_icon}
                              />
                            </div>
                            {
                              activeTab
                                ? (
                                  <Feedback
                                    show={this.state.validationError}
                                    status="error"
                                    className={`${this.state.validationError ? styles.feedbackError : ''} ${styles.feedbackMessage} amount-feedback`}
                                    showIcon={false}
                                    dark={dark}
                                  >
                                    {t('Unable to connect to the node, please check the address and try again')}
                                  </Feedback>
                                )
                                : ''
                            }
                            {
                              activeTab
                                ? (
                                  <div>
                                    <PrimaryButton
                                      disabled={this.state.connected}
                                    /* istanbul ignore next */
                                      onClick={this.onConnectToCustomNode}
                                      className={`${styles.button} ${styles.backButton} connect-button`}
                                    >
                                      {this.state.connected ? t('Connected') : t('Connect')}
                                    </PrimaryButton>
                                  </div>
                                )
                                : ''
                            }
                          </span>
                        );
                      }

                      return (
                        <span
                          onClick={() => {
                            this.changeNetwork(network.value);
                            this.validateCorrectNode(network.value);
                            this.toggleDropdown(false);
                            this.setState({ connected: false, isFirstTime: true });
                          }}
                          key={key}
                        >
                          {network.label}
                        </span>
                      );
                    })
                  }
                </Dropdown>
              </div>
              )
            }
            <UserAccount
              token={settings.token}
              signInHolderClassName={styles.settings}
              account={account}
              isDropdownEnable={showSettingDrowdown}
              onDropdownToggle={this.handleSettingsToggle}
              onLogout={this.onLogout}
              settingsUpdated={settingsUpdated}
              isUserLogout={isUserLogout}
              t={t}
            />
          </div>
        </div>
      </header>
    );
  }
}

Header.displayName = 'SigninHeader';
export default translate()(withRouter(Header));
