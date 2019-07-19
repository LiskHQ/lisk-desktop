import React from 'react';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import { extractPublicKey } from '../../utils/account';
import Box from '../box';
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

  render() {
    const {
      title, children, confirmButton, cancelButton, account, t, fee, confirmation, classNames,
    } = this.props;
    const {
      secondPassphrase, isHardwareWalletConnected, isConfirmed,
    } = this.state;

    return (
      <Box className={`${styles.wrapper} ${classNames}`}>
        <header className="summary-header">
          <h2>
            {title}
            {isHardwareWalletConnected ? t(' - Confirm transaction on your {{deviceModel}}', { deviceModel: account.hwInfo.deviceModel }) : ''}
          </h2>
        </header>
        <div className={styles.content}>
          <HardwareWalletIllustration account={account} size="s" />
          {children}
          <section>
            <label>
              {t('Transaction fee')}
              <Tooltip
                title={t('Transaction fee')}
                footer={(
                  <a
                    href={links.transactionFee}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {t('Read More')}
                  </a>
)}
              >
                <p className={styles.tooltipText}>
                  {
              t(`Every transaction needs to be confirmed and forged into Lisks blockchain network. 
                  Such operations require hardware resources and because of that there is a small fee for processing those.`)
            }
                </p>
              </Tooltip>
            </label>
            <label className={styles.feeValue}>
              {' '}
              {fee }
              {' '}
LSK
              {' '}
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
        </div>
        {
      isHardwareWalletConnected
        ? null
        : (
          <footer className="summary-footer">
            <PrimaryButtonV2
              className={`${styles.confirmBtn} confirm-button`}
              disabled={
              (!!account.secondPublicKey && !secondPassphrase.isValid)
              || (confirmation && !isConfirmed)
              || confirmButton.disabled}
              onClick={this.confirmOnClick}
            >
              {confirmButton.label}
            </PrimaryButtonV2>
            <TertiaryButtonV2
              className={`${styles.editBtn} cancel-button`}
              onClick={cancelButton.onClick}
            >
              {cancelButton.label}
            </TertiaryButtonV2>
          </footer>
        )
    }
      </Box>
    );
  }
}

export default TransactionSummary;
