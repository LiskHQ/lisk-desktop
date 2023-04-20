import NetworkSwitcherDropdown from '@network/components/networkSwitcherDropdown';
import UserApplicationSelector from '@blockchainApplication/manage/components/UserApplicationSelector/UserApplicationSelector';
import React from 'react';
import classNames from 'classnames';
import styles from './NetworkApplicationSelector.css';

function NetworkApplicationSelector({ className, onNetworkSwitchSuccess }) {
  return (
    <div className={classNames(styles.NetworkApplicationSelector, className)}>
      <NetworkSwitcherDropdown onNetworkSwitchSuccess={onNetworkSwitchSuccess} />
      <UserApplicationSelector className={styles.userApplicationSelectorProp} />
    </div>
  );
}

export default NetworkApplicationSelector;
