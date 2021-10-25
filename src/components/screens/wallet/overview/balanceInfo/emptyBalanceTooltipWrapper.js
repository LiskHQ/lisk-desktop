import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { networkKeys } from '@constants';
import { selectNetworkName } from '@store/selectors';
import Tooltip from '@toolbox/tooltip/tooltip';
import styles from './balanceInfo.css';

const getMessage = networkName => {
  switch (networkName) {
    case networkKeys.mainNet:
      return 'Purchase LSK from an exchange, or request LSK from another Lisk user through the wallet panel.';
    case networkKeys.testNet:
      return 'Request LSK from the Lisk Testnet faucet, or request LSK from another Lisk user through the wallet panel.';
    case networkKeys.customNode:
      return 'Request LSK from a faucet account, or request LSK from another Lisk user through the wallet panel.';
    default:
      return 'Request LSK from a faucet account, or request LSK from another Lisk user through the wallet panel.';
  }
};

const EmptyBalanceTooltipWrapper = ({
  children, t, hostBalance,
}) => {
  const networkName = useSelector(selectNetworkName);

  return (hostBalance === 0
    ? (
      <Tooltip
        className={styles.emptyBalanceTooltipWrapper}
        position="bottom"
        content={React.cloneElement(children, { className: `${children.props.className} ${styles.emptyBalanceTooltipChild} disabled` })}
      >
        <p>{t(getMessage(networkName))}</p>
      </Tooltip>
    )
    : children
  );
};

export default withTranslation()(EmptyBalanceTooltipWrapper);
