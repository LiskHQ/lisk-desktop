import React from 'react';

import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { networkKeys } from '@network/configuration/networks';
import styles from '../networkSelector.css';

const ReadMode = ({
  dropdownRef,
  setMode,
  storedCustomNetwork,
  customNetworkRemoved,
  networkSelected,
}) => {
  const edit = (e) => {
    e.preventDefault();
    setMode('edit');
  };

  const remove = (e) => {
    e.preventDefault();
    customNetworkRemoved();
    setMode('edit');
  };

  const connect = () => {
    networkSelected({
      name: networkKeys.customNode,
      initialSupply: 1,
      address: storedCustomNetwork,
    });
    dropdownRef.current.toggleDropdown(false);
  };

  return (
    <div className={`${styles.customNode} ${styles.readMode}`}>
      <span className={`${styles.title} custom-node-address`} onClick={connect}>
        {storedCustomNetwork}
      </span>
      <div className={styles.actions}>
        <TertiaryButton onClick={edit} size="m">
          <Icon name="edit" />
        </TertiaryButton>
        <TertiaryButton onClick={remove} size="m">
          <Icon name="remove" />
        </TertiaryButton>
      </div>
    </div>
  );
};

export default ReadMode;
