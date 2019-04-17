import React from 'react';
import i18next from 'i18next';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { SecondaryButtonV2, PrimaryButtonV2 } from '../toolbox/buttons/button';
import Input from 'react-toolbox/lib/input';
import { validateUrl, addHttp, getAutoLogInData, findMatchingLoginNetwork } from '../../utils/login';

import darkLogo from '../../assets/images/logo/lisk-logo-dark.svg';
import whiteLogo from '../../assets/images/logo/lisk-logo-white.svg';
import routes from '../../constants/routes';
import networks from '../../constants/networks';
import styles from './headerV2.css';
import autoSuggestInputStyles from '../autoSuggestV2/autoSuggest.css'
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';

class HeaderV2 extends React.Component {
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
      showDropdown: true,
      network: loginNetwork.code,
      isValid: false,
    };

    this.getNetworksList();

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  getNetworksList() {
    this.networks = Object.keys(networks)
      .filter(network => network !== 'default')
      .map((network, index) => ({
        label: i18next.t(networks[network].name),
        value: index,
      }));
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

  toggleDropdown() {
    const showDropdown = !this.state.showDropdown;
    this.setState({ showDropdown });
  }

  render() {
    const {
      t, showSettings, showNetwork, networkList,
      selectedNetwork, handleNetworkSelect,
      dark,
    } = this.props;
    return (
      <header className={`${styles.wrapper} mainHeader ${dark ? 'dark' : ''}`}>
        <div className={`${styles.headerContent}`}>
          <div className={`${styles.logo}`}>
            <img src={dark ? whiteLogo : darkLogo} />
          </div>
          <div className={`${styles.buttonsHolder}`}>
            {showNetwork
              && <span className={`${styles.dropdownHandler} network`}
                // onClick={this.toggleDropdown}
                >
                { networkList[selectedNetwork].label }
                <DropdownV2
                  showArrow={false}
                  showDropdown={this.state.showDropdown}>
                  {networkList && networkList.map((network, key) => {
                    if (network.value === 2) {
                      return <span
                      key={key}>
                        {network.label}
                        <Input
                          placeholder={'Title'}
                          onChange={value => {}}
                          className={`${autoSuggestInputStyles.input} autosuggest-input`}
                          theme={autoSuggestInputStyles}
                          onKeyDown={/* istanbul ignore next */(event) => {
                          }}
                          value={'hardwareAccountName'}/>

                          {!!this.state.isValid ? 'Unable to connect to the node, please check the address and try again' : ''}
                          <div>
                            <PrimaryButtonV2
                              onClick={() => handleNetworkSelect(network.value)}
                              className={`${styles.button} ${styles.backButton}`}>
                              {t('Connect')}
                            </PrimaryButtonV2>
                          </div>
                      </span>
                    }
                    return (<span
                      onClick={() => handleNetworkSelect(network.value)}
                      key={key}>{network.label}</span>
                    );
                  }
                )}
                </DropdownV2>
              </span>
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

export default translate()(HeaderV2);
