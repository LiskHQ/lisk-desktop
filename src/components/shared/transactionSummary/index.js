import React from 'react';
import LiskAmount from '@shared/liskAmount';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import CheckBox from '@toolbox/checkBox';
import HardwareWalletIllustration from '@toolbox/hardwareWalletIllustration';
import Tooltip from '@toolbox/tooltip/tooltip';
import { tokenMap } from '@constants';
import Footer from './footer';

import styles from './transactionSummary.css';

class TransactionSummary extends React.Component {
  constructor(props) {
    super(props);
    const { account } = props;

    this.state = {
      isHardwareWalletConnected: !!(account.hwInfo && account.hwInfo.deviceId),
    };
    this.confirmOnClick = this.confirmOnClick.bind(this);
    this.onConfirmationChange = this.onConfirmationChange.bind(this);
    this.getTooltip = this.getTooltip.bind(this);
  }

  componentDidMount() {
    const { isHardwareWalletConnected } = this.state;
    const { confirmButton } = this.props;

    if (isHardwareWalletConnected && !confirmButton.disabled) {
      this.confirmOnClick();
    }
  }

  componentDidUpdate(prevProps) {
    const { isHardwareWalletConnected } = this.state;
    const { confirmButton } = this.props;
    if (isHardwareWalletConnected && prevProps.confirmButton.disabled && !confirmButton.disabled) {
      this.confirmOnClick();
    }
  }

  confirmOnClick() {
    this.props.confirmButton.onClick();
  }

  onConfirmationChange() {
    this.setState({
      isConfirmed: !this.state.isConfirmed,
    });
  }

  getTooltip() {
    const { t, token } = this.props;
    return {
      LSK: {
        title: t('Transaction fee'),
        children: t('Transaction fees are required for every transaction to be accepted and forged by the Lisk network. When the network is busy, transactions with a higher fee are confirmed sooner.'),
      },
      BTC: {
        children: t('Transaction fees are required for every transaction to be accepted and mined by the Bitcoin network. When the network is busy, transactions with a higher fee are confirmed sooner.'),
      },
    }[token];
  }

  render() {
    const {
      title, children, confirmButton, cancelButton, keys,
      account, createTransaction, t, fee, confirmation, setSecondPass,
      classNames, token, footerClassName, showCancelButton = true,
    } = this.props;
    const {
      isHardwareWalletConnected, isConfirmed,
    } = this.state;

    const tooltip = this.getTooltip();

    return (
      <Box width="medium" className={`${styles.wrapper} ${classNames} summary`}>
        {title && (
          <BoxHeader className="summary-header">
            <h2>
              {title}
              {isHardwareWalletConnected ? t(' - Confirm transaction on your {{deviceModel}}', { deviceModel: account.hwInfo.deviceModel }) : ''}
            </h2>
          </BoxHeader>
        )}
        <BoxContent className={`${styles.content} summary-content`}>
          <HardwareWalletIllustration account={account} size="s" />
          {children}
          {fee && (
            <section>
              <label>
                {t('Transaction fee')}
                <Tooltip title={tooltip.title} footer={tooltip.footer} position="right">
                  <p className={styles.tooltipText}>{tooltip.children}</p>
                </Tooltip>
              </label>
              <label className={`${styles.feeValue} fee-value`}>
                <LiskAmount val={fee} token={token} convert={false} />
              </label>
            </section>
          )}
          {
            confirmation
              ? (
                <label className={styles.checkboxLabel}>
                  <CheckBox
                    checked={isConfirmed}
                    onChange={this.onConfirmationChange}
                    className={`${styles.checkbox} confirmation-checkbox`}
                  />
                  {confirmation}
                </label>
              )
              : null
          }
        </BoxContent>
        {!isHardwareWalletConnected && (
          <Footer
            confirmButton={confirmButton}
            cancelButton={cancelButton}
            footerClassName={footerClassName}
            showCancelButton={showCancelButton}
            confirmation={confirmation}
            isConfirmed={isConfirmed}
            createTransaction={createTransaction}
            isMultisignature={token === tokenMap.LSK.key && account.summary.isMultisignature}
            hasSecondPass={
              keys && keys.mandatoryKeys.length === 2 && keys.optionalKeys.length === 0
            }
            t={t}
            setSecondPass={setSecondPass}
          />
        )}
      </Box>
    );
  }
}

TransactionSummary.defaultProps = {
  token: 'LSK',
};

export default TransactionSummary;
