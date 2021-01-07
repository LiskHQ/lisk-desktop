import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { APIClient } from '@liskhq/lisk-client';

import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import { Input } from '../../../toolbox/inputs';
import { addHttp, getAutoLogInData } from '../../../../utils/login';
import { getNetworksList } from '../../../../utils/getNetwork';
import networks, { networkKeys } from '../../../../constants/networks';
import styles from './networkSelector.css';
import keyCodes from '../../../../constants/keyCodes';
import DropdownButton from '../../../toolbox/dropdownButton';
import { tokenMap } from '../../../../constants/tokens';
import { getNetworkConfig } from '../../../../utils/api/network';

const networkList = getNetworksList();

const getInitialState = (address) => {
  const { liskCoreUrl } = getAutoLogInData();
  return {
    address: liskCoreUrl || address,
    activeNetwork: networkKeys.mainNet,
    connected: true,
    isValid: true,
    isValidationLoading: false,
  };
};

// eslint-disable-next-line max-statements
const NetworkSelector = ({
  t, selectedNetwork, selectedAddress, networkSelected, settingsUpdated,
}) => {
  const childRef = useRef(null);
  const [state, _setState] = useState(() => getInitialState(selectedAddress));
  const setState = (newState) => { _setState({ ...state, ...newState }); };

  /**
   * @param chosenNetworkName {string}
   * @returns network {object}
   */
  const getNetwork = (chosenNetworkName) => {
    const { name, nodes, initialSupply } = networks[chosenNetworkName];
    const address = chosenNetworkName === networkKeys.customNode
      ? addHttp(state.address) : nodes[0];

    return {
      name,
      initialSupply,
      address,
    };
  };

  /**
   * @param networkName {string}
   */
  const changeNetwork = (networkName) => {
    const { name, address } = getNetwork(networkName);
    if (address !== 'http://') {
      settingsUpdated({ network: { name, address } });
    }
  };

  /**
   * @param {String} activeNetwork
   */
  const onChangeActiveNetwork = (activeNetwork) => {
    if (activeNetwork !== networkKeys.customNode) {
      changeNetwork(activeNetwork);
    }
    setState({ activeNetwork });
  };

  const setIsValid = (validity) => {
    setState({
      isValid: validity,
    });
  };

  const checkNodeStatus = async (showErrorToaster = true) => {
    const response = getNetworkConfig({
      name: state.activeNetwork,
      address: state.address,
    }, tokenMap.LSK.key);

    if (response.data) {
      if (state.activeNetwork === networkKeys.customNode) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }
    if (showErrorToaster) {
      toast.error(`Unable to connect to the node, Error: ${response.message}`);
    }
  };

  const changeAddress = ({ target }) => {
    const address = target.value;
    setState({
      address,
      connected: false,
      isValid: true,
    });
  };

  /* istanbul ignore next */
  // eslint-disable-next-line max-statements
  const validateCorrectNode = async (network) => {
    const newNetwork = getNetwork(network.name);

    if (network.name === networkKeys.customNode) {
      const liskAPIClient = new APIClient([network.address], {});
      try {
        const response = await liskAPIClient.node.getConstants();
        if (response.data) {
          networkSelected(newNetwork);
          setState({ isValid: true, connected: true });
          childRef.current.toggleDropdown();
          changeNetwork(networkKeys.customNode);
        } else {
          setIsValid(false);
        }
      } catch {
        setIsValid(false);
      }

      setState({ isValidationLoading: false });
    } else {
      networkSelected(newNetwork);
      setIsValid(true);
    }

    setState({ activeNetwork: network });
  };

  const onConnectToCustomNode = (e) => {
    e.stopPropagation();
    setState({ isValidationLoading: true });
    validateCorrectNode({ name: networkKeys.customNode, address: state.address });
  };

  useEffect(() => {
    checkNodeStatus(false);
  }, []);

  const {
    isValid,
    activeNetwork,
    connected,
    isValidationLoading, address,
  } = state;

  const validationError = isValid ? '' : t('Unable to connect to the node, please check the address and try again');

  return (
    <DropdownButton
      ref={childRef}
      buttonClassName={`${isValid ? styles.dropdownError : ''} ${styles.dropdownHandler} network`}
      wrapperClassName={styles.NetworkSelector}
      className={`${styles.menu} network-dropdown`}
      buttonLabel={(<span>{selectedNetwork.name}</span>)}
      ButtonComponent={SecondaryButton}
      align="right"
    >
      {
          networkList.map((network, key) => {
            const isActiveItem = networks[activeNetwork] !== undefined;

            if (network.value === networkKeys.customNode) {
              return (
                <span
                  className={`${styles.networkSpan} address`}
                  key={key}
                  onClick={() => onChangeActiveNetwork(network.value)}
                >
                  {network.label}
                  <div className={styles.inputWrapper}>
                    <Input
                      autoComplete="off"
                      onChange={(value) => { changeAddress(value); }}
                      name="customNetwork"
                      value={address}
                      placeholder={t('ie. 192.168.0.1')}
                      size="xs"
                      className={`custom-network ${styles.input} ${isValid ? styles.errorInput : ''}`}
                      onKeyDown={e => e.keyCode === keyCodes.enter
                      && onConnectToCustomNode(e)}
                      isLoading={isValidationLoading && address}
                      status={connected ? 'ok' : 'error'}
                      feedback={validationError}
                    />
                    {
                      isValid
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
                            disabled={connected}
                            /* istanbul ignore next */
                            onClick={onConnectToCustomNode}
                            className={`${styles.button} ${styles.backButton} connect-button`}
                            size="xs"
                          >
                            {connected ? t('Connected') : t('Connect')}
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
                  onChangeActiveNetwork(network.value);
                  validateCorrectNode({ name: network.value });
                  setState({ connected: false });
                  childRef.current.toggleDropdown();
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
};

NetworkSelector.displayName = 'NetworkSelector';
export default NetworkSelector;
