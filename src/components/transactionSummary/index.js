import React from 'react';

import { PrimaryButton, TertiaryButton } from '../toolbox/buttons/button';
import { extractPublicKey } from '../../utils/account';
import Box from '../toolbox/box';
import CheckBox from '../toolbox/checkBox';
import HardwareWalletIllustration from '../toolbox/hardwareWalletIllustration';
import PassphraseInput from '../passphraseInput/passphraseInput';
import Tooltip from '../toolbox/tooltip/tooltip';
import links from '../../constants/externalLinks';
import styles from './transactionSummary.css';

class TransactionSummary extends React.Component {
  constructor(props) {
    super(props);
    const { account } = props;

    this.state = {
      isHardwareWalletConnected: !!(account.hwInfo && account.hwInfo.deviceId),
      secondPassphrase: {
        isValid: false,
        feedback: '',
        value: null,
      },
    };
    this.checkSecondPassphrase = this.checkSecondPassphrase.bind(this);
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

  checkSecondPassphrase(passphrase, error) {
    let feedback = error || '';
    const expectedPublicKey = !error && extractPublicKey(passphrase);
    const isPassphraseValid = this.props.account.secondPublicKey === expectedPublicKey;

    if (feedback === '' && !isPassphraseValid) {
      feedback = this.props.t('Oops! Wrong passphrase');
    }
    this.setState({
      secondPassphrase: {
        ...this.state.secondPassphrase,
        isValid: feedback === '' && passphrase !== '',
        feedback,
        value: passphrase,
      },
    });
  }

  confirmOnClick() {
    this.props.confirmButton.onClick({
      secondPassphrase: this.state.secondPassphrase.value,
    });
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
        footer: <a
          href={links.transactionFee}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('Read more')}
        </a>,
        children: t(`Every transaction needs to be confirmed and forged into Lisks blockchain network. 
                    Such operations require hardware resources and because of that there is a small fee for processing those.`),
      },
      BTC: {
        children: t('Bitcoin transactions are made with some delay that depends on two parameters: the fee and the bitcoin network’s congestion. The higher the fee, the higher the processing speed.'),
      },
    }[token];
  }

  render() {
    const {
      title, children, confirmButton, cancelButton, account,
      t, fee, confirmation, classNames, token,
    } = this.props;
    const {
      secondPassphrase, isHardwareWalletConnected, isConfirmed,
    } = this.state;

    const tooltip = this.getTooltip();

    return (
      <Box width="medium" className={`${styles.wrapper} ${classNames} summary`}>
        <Box.Header className="summary-header">
          <h2>
            {title}
            {isHardwareWalletConnected ? t(' - Confirm transaction on your {{deviceModel}}', { deviceModel: account.hwInfo.deviceModel }) : ''}
          </h2>
        </Box.Header>
        <Box.Content className={`${styles.content} summary-content`}>
          <HardwareWalletIllustration account={account} size="s" />
          {children}
          <section>
            <label>
              {t('Transaction fee')}
              <Tooltip title={tooltip.title} footer={tooltip.footer}>
                <p className={styles.tooltipText}>{tooltip.children}</p>
              </Tooltip>
            </label>
            <label className={`${styles.feeValue} fee-value`}>
              {`${fee} ${token}`}
            </label>
          </section>
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
          {
        account.secondPublicKey
          ? (
            <section className={`${styles.tooltipContainer} summary-second-passphrase`}>
              <label>{t('Second passphrase')}</label>
              <Tooltip
                className={`${styles.tooltip}`}
                title={t('What is your second passphrase?')}
              >
                <React.Fragment>
                  <p className={`${styles.tooltupText}`}>
                    {t('Second passphrase is an optional extra layer of protection to your account. You can register at anytime, but you can not remove it.')}
                  </p>
                  <p className={`${styles.tooltipText}`}>
                    {t('If you see this field, you have registered a second passphrase in past and it is required to confirm transactions.')}
                  </p>
                </React.Fragment>
              </Tooltip>
              <PassphraseInput
                isSecondPassphrase={!!account.secondPublicKey}
                secondPPFeedback={secondPassphrase.feedback}
                inputsLength={12}
                maxInputsLength={24}
                onFill={this.checkSecondPassphrase}
              />
            </section>
          )
          : null
      }
        </Box.Content>
        {
      isHardwareWalletConnected
        ? null
        : (
          <Box.Footer className="summary-footer">
            <PrimaryButton
              className={`${styles.confirmBtn} confirm-button`}
              disabled={
              (!!account.secondPublicKey && !secondPassphrase.isValid)
              || (confirmation && !isConfirmed)
              || confirmButton.disabled}
              onClick={this.confirmOnClick}
            >
              {confirmButton.label}
            </PrimaryButton>
            <TertiaryButton
              className={`${styles.editBtn} cancel-button`}
              onClick={cancelButton.onClick}
            >
              {cancelButton.label}
            </TertiaryButton>
          </Box.Footer>
        )
    }
      </Box>
    );
  }
}

TransactionSummary.defaultProps = {
  token: 'LSK',
};

export default TransactionSummary;
