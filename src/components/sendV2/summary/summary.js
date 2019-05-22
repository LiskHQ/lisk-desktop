import React from 'react';
import ConverterV2 from '../../converterV2';
import AccountVisual from '../../accountVisual/index';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../../toolbox/buttons/button';
import fees from '../../../constants/fees';
import { fromRawLsk } from '../../../utils/lsk';
import PassphraseInputV2 from '../../passphraseInputV2/passphraseInputV2';
import Tooltip from '../../toolbox/tooltip/tooltip';
import links from '../../../constants/externalLinks';
import Piwik from '../../../utils/piwik';
import { extractPublicKey } from '../../../utils/account';
import { tokenMap } from '../../../constants/tokens';
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
    this.getConfirmButtonLabel = this.getConfirmButtonLabel.bind(this);
    this.getTitle = this.getTitle.bind(this);
    this.getTooltip = this.getTooltip.bind(this);
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
    this.props.sent({
      account: this.props.account,
      recipientId: this.props.fields.recipient.address,
      amount: this.props.fields.amount.value,
      data: this.props.fields.reference.value,
      passphrase: this.props.account.passphrase,
      secondPassphrase: this.state.secondPassphrase.value,
      dynamicFeePerByte: this.props.fields.processingSpeed.value,
      fee: fees.send,
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

  getConfirmButtonLabel() {
    const {
      account, fields, t, token,
    } = this.props;
    return this.state.isHardwareWalletConnected
      ? t('Confirm on {{deviceModel}}', { deviceModel: account.hwInfo.deviceModel })
      : t('Send {{amount}} {{token}}', { amount: fields.amount.value, token });
  }

  getTitle() {
    const {
      account, t,
    } = this.props;
    return this.state.isHardwareWalletConnected
      ? t('Confirm transaction on {{deviceModel}}', { deviceModel: account.hwInfo.deviceModel })
      : t('Transaction summary');
  }

  getTooltip() {
    const { t, token } = this.props;
    return {
      LSK: {
        title: t('Transaction fee'),
        footer: <a href={links.transactionFee}
            rel="noopener noreferrer"
            target="_blank">
              {t('Read More')}
          </a>,
        children: t(`Every transaction needs to be confirmed and forged into Lisks blockchain network. 
                    Such operations require hardware resources and because of that there is a small fee for processing those.`),
      },
      BTC: {
        children: t('Bitcoin transactions are made with some delay that depends on two parameters: the fee and the bitcoin network’s congestion. The higher the fee, the higher the processing speed.'),
      },
    }[token];
  }
  /* eslint-disable complexity */
  render() {
    const {
      fields, t, token,
    } = this.props;
    const { secondPassphrase, isHardwareWalletConnected } = this.state;
    const tooltip = this.getTooltip();

    const fee = token === tokenMap.LSK.key
      ? fromRawLsk(fees.send)
      : fromRawLsk(fields.processingSpeed.value);

    return (
      <div className={`${styles.wrapper} summary`}>
        <header className={`${styles.header} summary-header`}>
          <h1>{this.getTitle()}</h1>
        </header>

        <div className={`${styles.content} summary-content`}>
          <div className={styles.row}>
            <label>{t('Recipient')}</label>
            <div className={styles.account}>
              <AccountVisual address={fields.recipient.address} size={25} />
              <label className={`${styles.information} recipient-confirm`}>
                {fields.recipient.title || fields.recipient.address}
              </label>
              { fields.recipient.title ? (
                <span className={`${styles.secondText} ${styles.accountSecondText}`}>
                  {fields.recipient.address}
                </span>
              ) : null }
            </div>
          </div>

          <div className={styles.row}>
            <label>{t('Amount')}</label>
            <label className={`${styles.information} ${styles.amount} amount-summary`}>
              {`${fields.amount.value} ${token}`}
              <ConverterV2 className={`${styles.secondText} ${styles.amountSecondText}`} value={fields.amount.value} />
            </label>
          </div>

          {token === 'LSK' && fields.reference.value !== '' ? (
            <div className={styles.row}>
              <label>{t('Message')}</label>
              <p className={`${styles.information} reference`}>{fields.reference.value}</p>
            </div>
          ) : null}

          <div className={styles.row}>
            <label className={styles.transactionFee}>
              {t('Transaction fee')}
              <Tooltip
                className={'showOnTop'}
                title={tooltip.title}
                footer={tooltip.footer}
              >
                <p className={styles.tooltipText}>
                  {tooltip.children}
                </p>
              </Tooltip>
            </label>
            <span>{t('{{fee}} {{token}}', { fee, token })}</span>
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
            disabled={
              (secondPassphrase.hasSecondPassphrase &&
                !secondPassphrase.isValid)
              || isHardwareWalletConnected
            }>
            {this.getConfirmButtonLabel()}
          </PrimaryButtonV2>

          {this.props.account.hwInfo && this.props.account.hwInfo.deviceId ? null :
            <TertiaryButtonV2 className={`${styles.editBtn} on-prevStep`} onClick={this.prevStep}>
              {t('Edit transaction')}
            </TertiaryButtonV2>}
        </footer>
      </div>
    );
  }
}

export default Summary;
