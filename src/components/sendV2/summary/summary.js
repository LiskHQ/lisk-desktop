import React from 'react';
import ConverterV2 from '../../converterV2';
import AccountVisual from '../../accountVisual/index';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../../toolbox/buttons/button';
import fees from '../../../constants/fees';
import { fromRawLsk } from '../../../utils/lsk';
import PassphraseInputV2 from '../../passphraseInputV2/passphraseInputV2';
import Tooltip from '../../toolbox/tooltip/tooltip';
import links from '../../../constants/externalLinks';
import Piwik from '../../../utils/piwik';
import { extractPublicKey } from '../../../utils/account';
import styles from './summary.css';

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isHardwareWalletConnected: false,
      secondPassphrase: {
        hasSecondPassphrase: false,
        isValid: false,
        feedback: '',
        value: null,
      },
    };

    this.checkForHardwareWallet = this.checkForHardwareWallet.bind(this);
    this.checkSecondPassphrase = this.checkSecondPassphrase.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.submitTransaction = this.submitTransaction.bind(this);
  }

  componentDidMount() {
    const { account } = this.props;
    let newState = {};

    // istanbul ignore else
    if (account && account.secondPublicKey) {
      newState = {
        ...this.state,
        secondPassphrase: {
          ...this.state.secondPassphrase,
          hasSecondPassphrase: true,
        },
      };
    }

    // istanbul ignore else
    if (account.hwInfo && account.hwInfo.deviceId) {
      newState = {
        ...this.state,
        isHardwareWalletConnected: true,
        isLoading: true,
      };
      this.submitTransaction();
    }

    this.setState(newState);
  }

  componentDidUpdate() {
    this.checkForHardwareWallet();
  }

  submitTransaction() {
    this.props.sent({
      account: this.props.account,
      recipientId: this.props.fields.recipient.address,
      amount: this.props.fields.amount.value,
      data: this.props.fields.reference.value,
      passphrase: this.props.account.passphrase,
      secondPassphrase: this.state.secondPassphrase.value,
    });
  }

  checkForHardwareWallet() {
    const { failedTransactions, pendingTransactions } = this.props;
    const { isHardwareWalletConnected, isLoading } = this.state;

    const hasPendingTransaction = isHardwareWalletConnected
      ? pendingTransactions.find(transaction => (
        transaction.senderId === this.props.account.address &&
        transaction.recipientId === this.props.fields.recipient.address &&
        fromRawLsk(transaction.amount) === this.props.fields.amount.value
      ))
      : pendingTransactions.length;

    // istanbul ignore else
    if (isLoading && (hasPendingTransaction || failedTransactions)) {
      this.props.nextStep({
        fields: {
          ...this.props.fields,
          hwTransactionStatus: hasPendingTransaction ? 'success' : 'error',
          isHardwareWalletConnected: this.state.isHardwareWalletConnected,
        },
      });
    }
  }

  checkSecondPassphrase(passphrase, error) {
    // istanbul ignore else
    if (!error) {
      const expectedPublicKey = extractPublicKey(passphrase);
      const isPassphraseValid = this.props.account.secondPublicKey === expectedPublicKey;

      if (isPassphraseValid) {
        this.setState({
          secondPassphrase: {
            ...this.state.secondPassphrase,
            isValid: true,
            feedback: '',
            value: passphrase,
          },
        });
      } else {
        this.setState({
          secondPassphrase: {
            ...this.state.secondPassphrase,
            isValid: false,
            feedback: this.props.t('Oops! Wrong passphrase'),
          },
        });
      }
    }
  }

  prevStep() {
    Piwik.trackingEvent('Send_Summary', 'button', 'Previous step');
    this.props.prevStep({ ...this.props.fields });
  }

  nextStep() {
    Piwik.trackingEvent('Send_Summary', 'button', 'Next step');
    this.submitTransaction();
    this.props.nextStep({
      fields: {
        ...this.props.fields,
        hwTransactionStatus: false,
        isHardwareWalletConnected: false,
      },
    });
  }

  render() {
    const { secondPassphrase, isHardwareWalletConnected } = this.state;
    let isBtnDisabled = secondPassphrase.hasSecondPassphrase
      ? secondPassphrase.isValid !== '' && !secondPassphrase.isValid
      : false;
    isBtnDisabled = !isBtnDisabled && isHardwareWalletConnected;

    const confirmBtnMessage = isHardwareWalletConnected
      ? this.props.t('Confirm on Ledger')
      : this.props.t('Send {{amount}} LSK', { amount: this.props.fields.amount.value });

    const title = isHardwareWalletConnected
      ? this.props.t('Confirm transaction on Ledger Nano S')
      : this.props.t('Transaction summary');


    return (
      <div className={`${styles.wrapper} summary`}>
        <header className={`${styles.header} summary-header`}>
          <h1>{title}</h1>
        </header>

        <div className={`${styles.content} summary-content`}>
          <div className={styles.row}>
            <label>{this.props.t('Recipient')}</label>
            <div className={styles.account}>
              <AccountVisual address={this.props.fields.recipient.address} size={25} />
              <label className={`${styles.information} recipient-confirm`}>
                {this.props.fields.recipient.title || this.props.fields.recipient.address}
              </label>
              <span className={`${styles.secondText} ${styles.accountSecondText}`}>
                {this.props.fields.recipient.addres}
              </span>
            </div>
          </div>

          <div className={styles.row}>
            <label>{this.props.t('Amount of transaction')}</label>
            <label className={`${styles.information} ${styles.amount} amount-summary`}>
              {`${this.props.fields.amount.value} ${this.props.t('LSK')}`}
              <ConverterV2 className={`${styles.secondText} ${styles.amountSecondText}`} value={this.props.fields.amount.value} />
            </label>
          </div>

          <div className={styles.row}>
            <label>{this.props.t('Message')}</label>
            <p className={`${styles.information} reference`}>{this.props.fields.reference.value}</p>
          </div>

          {
            secondPassphrase.hasSecondPassphrase
            ? <div className={`${styles.row} ${styles.passphrase} summary-second-passphrase`}>
                <label>{this.props.t('Second passphrase')}</label>
                <PassphraseInputV2
                  isSecondPassphrase={secondPassphrase.hasSecondPassphrase}
                  secondPPFeedback={secondPassphrase.feedback}
                  inputsLength={12}
                  maxInputsLength={24}
                  onFill={this.checkSecondPassphrase} />
              </div>
            : null
          }
        </div>

        <footer className={`${styles.footer} summary-footer`}>
          <SecondaryButtonV2 className={`${styles.btn} on-prevStep`} onClick={this.prevStep}>
            {this.props.t('Edit transaction')}
          </SecondaryButtonV2>

          <div className={styles.feeMessage}>
            <label>
              {this.props.t('Transaction fee')}
              <Tooltip
                className={'showOnTop'}
                title={this.props.t('Transaction fee')}
                footer={
                  <a href={links.transactionFee}
                    rel="noopener noreferrer"
                    target="_blank">
                      {this.props.t('Read More')}
                  </a>
                }
              >
                <p>
                {
                  this.props.t(`Every transaction needs to be confirmed and forged into Lisks blockchain network. 
                  Such operations require hardware resources and because of that we ask for a small fee for processing those.`)
                }
                </p>
              </Tooltip>
            </label>
            <span>{this.props.t('+{{fee}} LSK', { fee: fromRawLsk(fees.send) })}</span>
          </div>

          <PrimaryButtonV2
            className={`${styles.btn} on-nextStep send-button`}
            onClick={this.nextStep}
            disabled={isBtnDisabled}>
            {confirmBtnMessage}
          </PrimaryButtonV2>
        </footer>
      </div>
    );
  }
}

export default Summary;
