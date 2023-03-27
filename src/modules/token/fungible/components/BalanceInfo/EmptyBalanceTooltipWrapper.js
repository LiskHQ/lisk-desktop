import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { networkKeys } from '@network/configuration/networks';
import { selectNetworkName } from 'src/redux/selectors';
import Tooltip from 'src/theme/Tooltip';
import styles from './BalanceInfo.css';

const getMessage = (networkName) => {
  switch (networkName) {
    case networkKeys.mainnet:
      return 'Purchase LSK from an exchange, or request LSK from another Lisk user through the wallet panel.';
    case networkKeys.testNet:
      return 'Request LSK from the Lisk Testnet faucet, or request LSK from another Lisk user through the wallet panel.';
    case networkKeys.customNode:
      return 'Request LSK from a faucet account, or request LSK from another Lisk user through the wallet panel.';
    default:
      return 'Request LSK from a faucet account, or request LSK from another Lisk user through the wallet panel.';
  }
};

const EmptyBalanceTooltipWrapper = ({ children, t, hostBalance }) => {
  const networkName = useSelector(selectNetworkName);

  return hostBalance === 0 ? (
    <Tooltip
      className={`${styles.emptyBalanceTooltipWrapper} empty-balance-tooltip-wrapper`}
      position="bottom left"
      content={React.cloneElement(children, {
        className: `${children.props.className} ${styles.emptyBalanceTooltipChild} disabled`,
      })}
    >
      <p>{t(getMessage(networkName))}</p>
    </Tooltip>
  ) : (
    children
  );
};

export default withTranslation()(EmptyBalanceTooltipWrapper);
