import React, { useRef } from 'react';

import networks, { networkKeys } from '@network/configuration/networks';
import { addHttp } from '@common/utilities/login';
import { SecondaryButton } from '@basics/buttons';
import DropdownButton from 'src/theme/DropdownButton';
import { getNetworksList } from '@network/utils/getNetwork';
import CustomNode from './customNode';

import styles from './networkSelector.css';

/**
 * Returns the required config to set the network
 * @param {string} name - Options of mainnet, testnet and customNode
 * @param {string?} url - A valid URL
 * @returns {object} The config to set the network
 */
const getNetwork = (name, url = '') => {
  const { serviceUrl, initialSupply } = networks[name];
  const address = name === networkKeys.customNode
    ? addHttp(url) : serviceUrl;

  return {
    name,
    initialSupply,
    address,
  };
};

// eslint-disable-next-line max-statements
const NetworkSelector = ({
  network, settings, networkSelected,
}) => {
  const networkList = getNetworksList();
  const childRef = useRef(null);
  const selectedNetworkName = network.name || settings.network?.name || 'mainnet';

  return (
    <DropdownButton
      ref={childRef}
      buttonClassName={`${styles.dropdownHandler} network`}
      wrapperClassName={styles.NetworkSelector}
      className={`${styles.menu} network-dropdown`}
      buttonLabel={(<span>{networks[selectedNetworkName]?.label}</span>)}
      buttonType="button"
      ButtonComponent={SecondaryButton}
      align="right"
    >
      {
        networkList
          .filter(item => item.name !== networkKeys.customNode)
          .map((item, key) => (
            <span
              key={key}
              onClick={() => {
                networkSelected(getNetwork(item.name));
                childRef.current.toggleDropdown(false);
              }}
            >
              {item.label}
            </span>
          ))
      }
      <CustomNode dropdownRef={childRef} />
    </DropdownButton>
  );
};

NetworkSelector.displayName = 'NetworkSelector';
export default NetworkSelector;
