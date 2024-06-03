import NetworkSwitcherDropdown from '@network/components/networkSwitcherDropdown';
import React from 'react';
import classNames from 'classnames';
import styles from './NetworkApplicationSelector.css';

function NetworkApplicationSelector({ className, onNetworkSwitchSuccess }) {
  return (
    <div className={classNames(styles.NetworkApplicationSelector, className)}>
      <NetworkSwitcherDropdown onNetworkSwitchSuccess={onNetworkSwitchSuccess} />
    </div>
  );
}

export default NetworkApplicationSelector;
