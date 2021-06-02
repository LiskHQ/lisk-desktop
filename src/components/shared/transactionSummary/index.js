import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import { transactionToJSON, downloadJSON } from '@utils/transaction';
import LiskAmount from '@shared/liskAmount';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import CheckBox from '@toolbox/checkBox';
import HardwareWalletIllustration from '@toolbox/hardwareWalletIllustration';
import Tooltip from '@toolbox/tooltip/tooltip';
import copyToClipboard from 'copy-to-clipboard';
import Icon from '@toolbox/icon';
import { tokenMap } from '@constants';

import styles from './transactionSummary.css';

const Footer = ({
  confirmButton, cancelButton, footerClassName, showCancelButton,
  confirmation, isConfirmed, isMultisignature, t, createTransaction,
}) => {
  const [copied, setCopied] = useState(false);

  const onDownload = (transaction) => {
    downloadJSON(transaction, `tx-${transaction.moduleID}-${transaction.assetID}`);
  };

  const onCopy = (transaction) => {
    copyToClipboard(transactionToJSON(transaction));
    setCopied(true);
  };

  return (
    <BoxFooter className={`${footerClassName} summary-footer`} direction="horizontal">
      {isMultisignature ? (
        <>
          <SecondaryButton
            className="cancel-button"
            onClick={cancelButton.onClick}
          >
            {t('Cancel')}
          </SecondaryButton>
          <SecondaryButton
            className="copy-button"
            onClick={() => {
              createTransaction(onCopy);
            }}
          >
            <span className={styles.buttonContent}>
              <Icon name={copied ? 'checkmark' : 'copy'} />
              {t(copied ? 'Copied' : 'Copy')}
            </span>
          </SecondaryButton>
          <PrimaryButton
            className="download-button"
            onClick={() => {
              createTransaction(onDownload);
            }}
          >
            <span className={styles.buttonContent}>
              <Icon name="download" />
              {t('Download')}
            </span>
          </PrimaryButton>
        </>
      ) : (
        <>
          {showCancelButton && (
            <SecondaryButton
              className="cancel-button"
              onClick={cancelButton.onClick}
            >
              {cancelButton.label}
            </SecondaryButton>
          )}
          <PrimaryButton
            className="confirm-button"
            disabled={(confirmation && !isConfirmed) || confirmButton.disabled}
            onClick={confirmButton.onClick}
          >
            {confirmButton.label}
          </PrimaryButton>
        </>
      )}
    </BoxFooter>
  );
};

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
        children: t(`Every transaction needs to be confirmed and forged into Lisk blockchain network. 
                    Such operations require hardware resources and because of that there is a small fee for processing those.`),
      },
      BTC: {
        children: t('Bitcoin transactions are made with some delay that depends on two parameters: the fee and the bitcoin network’s congestion. The higher the fee, the higher the processing speed.'),
      },
    }[token];
  }

  render() {
    const {
      title, children, confirmButton, cancelButton, account, createTransaction, t,
      fee, confirmation, classNames, token, footerClassName, showCancelButton = true,
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
            t={t}
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
