/* eslint-disable max-lines */
import React from 'react';
import { toast } from 'react-toastify';
import { APIClient } from '@liskhq/lisk-client';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';

import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import { Input } from '../../../toolbox/inputs';
import { addHttp, getAutoLogInData } from '../../../../utils/login';
import { getNetworksList } from '../../../../utils/getNetwork';
import networks from '../../../../constants/networks';
import styles from './networkSelector.css';
import keyCodes from '../../../../constants/keyCodes';
import DropdownButton from '../../../toolbox/dropdownButton';
import { tokenMap } from '../../../../constants/tokens';
import { getNetworkConfig } from '../../../../utils/api/network';

class NetworkSelector extends React.Component {
  constructor(props) {
    super(props);
    const { liskCoreUrl } = getAutoLogInData();
    const address = liskCoreUrl || props.address;

    this.state = {
      address,
      showDropdown: false,
      showSettingDropdown: false,
      isFirstTime: true,
      activeNetwork: 'mainnet',
      connected: true,
    };

    this.onConnectToCustomNode = this.onConnectToCustomNode.bind(this);
    this.checkNodeStatus = this.checkNodeStatus.bind(this);
    this.onChangeActiveNetwork = this.onChangeActiveNetwork.bind(this);
  }

  componentDidMount() {
    this.checkNodeStatus(false);
  }

  componentDidUpdate(prevProps) {
    const { address, network } = this.props;
    if (address !== prevProps.address) this.setState(() => ({ address }));
    if (network.name !== prevProps.network.name) {
      this.setState({ activeNetwork: network.networks.LSK.code });
    }
    if (network.name !== prevProps.network.name) {
      this.checkNodeStatus(false);
    }
    if (network.name === networks.customNode.name && address !== prevProps.address) {
      this.checkNodeStatus(false);
    }
  }

  /**
   * @param {String} activeNetwork
   */
  onChangeActiveNetwork(activeNetwork) {
    if (activeNetwork !== 'customNode') this.changeNetwork(activeNetwork);
    this.setState({ activeNetwork });
  }

  // eslint-disable-next-line max-statements
  async checkNodeStatus(showErrorToaster = true) {
    const response = getNetworkConfig({
      name: this.state.activeNetwork,
      network: { address: this.state.address },
    }, tokenMap.LSK.key);

    if (response.data) {
      if (this.state.activeNetwork === 'customNode') {
        this.setValidationError();
      } else {
        this.setState(({ validationError: '' }));
      }
    }
    if (showErrorToaster) {
      toast.error(`Unable to connect to the node, Error: ${response.message}`);
    }
  }

  changeAddress({ target }) {
    const address = target.value;
    this.setState({
      address,
      isFirstTime: true,
      connected: false,
      validationError: '',
    });
  }

  /**
   * @param network {string}
   */
  changeNetwork(network) {
    this.setState({ network });
    const { name, address } = this.getNetwork(network);
    if (address !== 'http://') this.props.settingsUpdated({ network: { name, address } });
  }

  /**
   * @param chosenNetwork {string}
   * @returns network {object}
   */
  getNetwork(chosenNetwork) {
    const { name, nodes, initialSupply } = networks[chosenNetwork];
    return {
      name,
      initialSupply,
      address: chosenNetwork === 'customNode'
        ? addHttp(this.state.address) : nodes[0],
    };
  }

  setValidationError() {
    this.setState({
      validationError: this.props.t('Unable to connect to the node, please check the address and try again'),
    });
  }

  /* istanbul ignore next */
  validateCorrectNode(network) {
    const newNetwork = this.getNetwork(network.name);

    if (network.name === 'customNode') {
      const liskAPIClient = new APIClient([network.address], {});
      liskAPIClient.node.getConstants()
        .then((res) => {
          if (res.data) {
            this.props.networkSet({
              name: newNetwork.name,
              network: newNetwork,
            });

            this.setState({ validationError: '', connected: true });
            this.childRef.toggleDropdown();
            this.changeNetwork('customNode');
          } else {
            this.setValidationError();
          }
        })
        .catch(() => {
          this.setValidationError();
        });

      this.setState({ isValidationLoading: false, isFirstTime: false });
    } else {
      this.props.networkSet({
        name: newNetwork.name,
        network: newNetwork,
      });
      this.setState({ validationError: '' });
    }

    this.setState({ network });
  }

  onConnectToCustomNode(e) {
    e.stopPropagation();
    this.setState({ isValidationLoading: true });
    this.validateCorrectNode({ name: 'customNode', address: this.state.address });
  }

  /* istanbul ignore next */
  render() {
    const {
      dark,
      selectedNetwork,
      t,
    } = this.props;
    const {
      isValidationLoading,
      connected,
      validationError,
    } = this.state;
    const { activeNetwork } = this.state;
    const networkList = getNetworksList();

    return (
      <DropdownButton
        buttonClassName={`${validationError ? styles.dropdownError : ''} ${styles.dropdownHandler} network`}
        wrapperClassName={styles.NetworkSelector}
        className={`${styles.menu} ${dark ? 'dark' : ''} network-dropdown`}
        buttonLabel={(<span>{networks[selectedNetwork].name}</span>)}
        ButtonComponent={SecondaryButton}
        align="right"
        ref={(node) => { this.childRef = node; }}
      >
        {
          networkList.map((network, key) => {
            const isActiveItem = networks[activeNetwork] !== undefined;


            if (network.value === 'customNode') {
              return (
                <span
                  className={`${styles.networkSpan} address`}
                  key={key}
                  onClick={() => this.onChangeActiveNetwork(network.value)}
                >
                  {network.label}
                  <div className={styles.inputWrapper}>
                    <Input
                      autoComplete="off"
                      onChange={(value) => { this.changeAddress(value); }}
                      name="customNetwork"
                      value={this.state.address}
                      placeholder={this.props.t('ie. 192.168.0.1')}
                      size="xs"
                      className={`custom-network ${styles.input} ${validationError ? styles.errorInput : ''}`}
                      onKeyDown={e => e.keyCode === keyCodes.enter
                      && this.onConnectToCustomNode(e)}
                      isLoading={isValidationLoading && this.state.address}
                      status={connected ? 'ok' : 'error'}
                      feedback={validationError}
                      dark={dark}
                    />
                    {
                      validationError
                        ? (
                          <span className={styles.customNodeError}>
                            {validationError}
                          </span>
                        )
                        : null
                    }
                  </div>
                  {
                    isActiveItem
                      ? (
                        <div>
                          <PrimaryButton
                            disabled={this.state.connected}
                          /* istanbul ignore next */
                            onClick={this.onConnectToCustomNode}
                            className={`${styles.button} ${styles.backButton} connect-button`}
                            size="xs"
                          >
                            {this.state.connected ? t('Connected') : t('Connect')}
                          </PrimaryButton>
                        </div>
                      )
                      : null
                  }
                </span>
              );
            }

            return (
              <span
                onClick={() => {
                  this.onChangeActiveNetwork(network.value);
                  this.validateCorrectNode({ name: network.value });
                  this.setState({ connected: false, isFirstTime: true });
                  this.childRef.toggleDropdown();
                }}
                key={key}
              >
                {network.label}
              </span>
            );
          })
        }
      </DropdownButton>
    );
  }
}

NetworkSelector.displayName = 'NetworkSelector';
export default withTranslation()(withRouter(NetworkSelector));
