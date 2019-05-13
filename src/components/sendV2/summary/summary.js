import React from 'react';
import ConverterV2 from '../../converterV2';
import AccountVisual from '../../accountVisual/index';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../../toolbox/buttons/button';
import fees from '../../../constants/fees';
import { fromRawLsk, toRawLsk } from '../../../utils/lsk';
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
    const { account, fields } = this.props;

    this.props.sent({
      amount: toRawLsk(fields.amount.value),
      data: fields.reference.value,
      passphrase: account.passphrase,
      recipientId: fields.recipient.address,
      secondPassphrase: this.state.secondPassphrase.value,
      dynamicFeePerByte: null, // for BTC
      fee: null, // for BTC
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
    const { account, fields } = this.props;
    Piwik.trackingEvent('Send_Summary', 'button', 'Next step');
    this.submitTransaction();
    this.props.nextStep({
      fields: {
        ...fields,
        hwTransactionStatus: false,
        isHardwareWalletConnected: false,
      },
      transactionData: {
        amount: toRawLsk(fields.amount.value),
        data: fields.reference.value,
        passphrase: account.passphrase,
        recipientId: fields.recipient.address,
        secondPassphrase: this.state.secondPassphrase.value,
        dynamicFeePerByte: null, // for BTC
        fee: null, // for BTC
      },
    });
  }

  render() {
    const { account, fields, t } = this.props;
    const { secondPassphrase, isHardwareWalletConnected } = this.state;
    let isBtnDisabled = secondPassphrase.hasSecondPassphrase && secondPassphrase.isValid !== '' && !secondPassphrase.isValid;
    isBtnDisabled = !isBtnDisabled && isHardwareWalletConnected;

    const confirmBtnMessage = isHardwareWalletConnected
      ? t('Confirm on {{deviceModel}}', { deviceModel: account.hwInfo.deviceModel })
      : t('Send {{amount}} LSK', { amount: fields.amount.value });

    const title = isHardwareWalletConnected
      ? t('Confirm transaction on {{deviceModel}}', { deviceModel: account.hwInfo.deviceModel })
      : t('Transaction summary');

    return (
      <div className={`${styles.wrapper} summary`}>
        <header className={`${styles.header} summary-header`}>
          <h1>{title}</h1>
        </header>

        <div className={`${styles.content} summary-content`}>
          <div className={styles.row}>
            <label>{t('Recipient')}</label>
            <div className={styles.account}>
              <AccountVisual address={fields.recipient.address} size={25} />
              <label className={`${styles.information} recipient-confirm`}>
                {fields.recipient.title || fields.recipient.address}
              </label>
              <span className={`${styles.secondText} ${styles.accountSecondText}`}>
                {fields.recipient.address}
              </span>
            </div>
          </div>

          <div className={styles.row}>
            <label>{t('Amount')}</label>
            <label className={`${styles.information} ${styles.amount} amount-summary`}>
              {`${fields.amount.value} ${t('LSK')}`}
              <ConverterV2 className={`${styles.secondText} ${styles.amountSecondText}`} value={fields.amount.value} />
            </label>
          </div>

          <div className={styles.row}>
            <label>{t('Message')}</label>
            <p className={`${styles.information} reference`}>{fields.reference.value}</p>
          </div>

          <div className={styles.row}>
            <label className={styles.transactionFee}>
              {t('Transaction fee')}
              <Tooltip
                className={'showOnTop'}
                title={t('Transaction fee')}
                footer={
                  <a href={links.transactionFee}
                    rel="noopener noreferrer"
                    target="_blank">
                      {t('Read More')}
                  </a>
                }
              >
                <p className={styles.tooltipText}>
                {
                  t(`Every transaction needs to be confirmed and forged into Lisks blockchain network. 
                  Such operations require hardware resources and because of that there is a small fee for processing those.`)
                }
                </p>
              </Tooltip>
            </label>
            <span>{t('{{fee}} LSK', { fee: fromRawLsk(fees.send) })}</span>
          </div>

          {
            secondPassphrase.hasSecondPassphrase
            ? <div className={`${styles.row} ${styles.passphrase} summary-second-passphrase`}>
                <label>{t('Second passphrase')}</label>
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
          <PrimaryButtonV2
            className={`${styles.confirmBtn} on-nextStep send-button`}
            onClick={this.nextStep}
            disabled={isBtnDisabled}>
            {confirmBtnMessage}
          </PrimaryButtonV2>

          <TertiaryButtonV2 className={`${styles.editBtn} on-prevStep`} onClick={this.prevStep}>
            {t('Edit transaction')}
          </TertiaryButtonV2>
        </footer>
      </div>
    );
  }
}

export default Summary;
