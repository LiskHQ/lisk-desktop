/* eslint-disable max-lines */
import React from 'react';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import { extractPublicKey } from '../../../utils/account';
import { fromRawLsk, toRawLsk } from '../../../utils/lsk';
import { loginType } from '../../../constants/hwConstants';
import { tokenMap } from '../../../constants/tokens';
import AccountVisual from '../../accountVisual/index';
import Box from '../../toolbox/box';
import Converter from '../../converter';
import HardwareWalletIllustration from
  '../../toolbox/hardwareWalletIllustration';
import PassphraseInput from '../../passphraseInput/passphraseInput';
import Piwik from '../../../utils/piwik';
import Tooltip from '../../toolbox/tooltip/tooltip';
import TransactionSummary from '../../transactionSummary';
import fees from '../../../constants/fees';
import links from '../../../constants/externalLinks';
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
    this.checkForSuccessOrFailedTransactions();
  }

  submitTransaction() {
    Piwik.trackingEvent('Send_SubmitTransaction', 'button', 'Next step');
    const { account, fields } = this.props;

    this.props.transactionCreated({
      amount: `${toRawLsk(fields.amount.value)}`,
      data: fields.reference.value,
      passphrase: account.passphrase,
      recipientId: fields.recipient.address,
      secondPassphrase: this.state.secondPassphrase.value,
      dynamicFeePerByte: this.props.fields.processingSpeed.value,
      fee: fees.send,
    });
  }

  checkForHardwareWallet() {
    const { transactions } = this.props;
    const { isHardwareWalletConnected, isLoading } = this.state;

    const hasPendingTransaction = isHardwareWalletConnected
      ? transactions.pending.find(transaction => (
        transaction.senderId === this.props.account.address
        && transaction.recipientId === this.props.fields.recipient.address
        && fromRawLsk(transaction.amount) === this.props.fields.amount.value
      ))
      : transactions.pending.length;

    // istanbul ignore else
    if (isLoading && (hasPendingTransaction || transactions.failed)) {
      this.props.nextStep({
        fields: {
          ...this.props.fields,
          hwTransactionStatus: hasPendingTransaction ? 'success' : 'error',
          isHardwareWalletConnected: this.state.isHardwareWalletConnected,
        },
      });
    }
  }

  checkForSuccessOrFailedTransactions() {
    const {
      account,
      fields,
      nextStep,
      transactions,
    } = this.props;

    if (account.loginType !== loginType.normal && transactions.transactionsCreatedFailed.length) {
      nextStep({
        fields: {
          ...fields,
          hwTransactionStatus: 'error',
          isHardwareWalletConnected: true,
        },
      });
    }

    if (transactions.transactionsCreated.length && !transactions.transactionsCreatedFailed.length) {
      nextStep({
        fields: {
          ...fields,
          hwTransactionStatus: false,
          isHardwareWalletConnected: false,
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
    this.props.resetTransactionResult();
    this.props.prevStep({ ...this.props.fields });
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
    return t('Transaction summary') + (account.hwInfo.deviceModel
      ? t(' - Confirm transaction on your {{deviceModel}}', { deviceModel: account.hwInfo.deviceModel })
      : '');
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
      fields, t, token, account,
    } = this.props;
    const { secondPassphrase } = this.state;
    const tooltip = this.getTooltip();

    const fee = token === tokenMap.LSK.key
      ? fromRawLsk(fees.send)
      : fromRawLsk(fields.processingSpeed.txFee);

    return (
      <TransactionSummary
        title={this.getTitle()}
        t={t}
        account={account}
        confirmButton={{
          label: this.getConfirmButtonLabel(),
          onClick: this.submitTransaction,
        }}
        cancelButton={{
          label: t('Edit transaction'),
          onClick: this.prevStep,
        }}
        fee={fee}
      >
        <section>
          <label>{t('Recipient')}</label>
          <label>
            <AccountVisual address={fields.recipient.address} size={25} />
            <label className={`${styles.information} recipient-confirm`}>
              {fields.recipient.title || fields.recipient.address}
            </label>
            { fields.recipient.title ? (
              <span className={styles.secondText}>
                {fields.recipient.address}
              </span>
            ) : null }
          </label>
        </section>
        <section>
          <label>{t('Amount')}</label>
          <label className="amount-summary">
            {`${fields.amount.value} ${token}`}
            <Converter className={styles.secondText} value={fields.amount.value} />
          </label>
        </section>
      </TransactionSummary>
    );
    // eslint-disable-next-line
    return (
      <Box className={`${styles.wrapper} summary`} width="medium">
        <Box.Header className="summary-header">
          <h2>{this.getTitle()}</h2>
        </Box.Header>
        <HardwareWalletIllustration account={account} size="s" />

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
              <Converter className={`${styles.secondText} ${styles.amountSecondText}`} value={fields.amount.value} />
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
                className="showOnTop"
                title={tooltip.title}
                footer={tooltip.footer}
              >
                <p className={styles.tooltipText}>
                  {tooltip.children}
                </p>
              </Tooltip>
            </label>
            <span className={styles.information}>{t('{{fee}} {{token}}', { fee, token })}</span>
          </div>

          {
            secondPassphrase.hasSecondPassphrase
              ? (
                <div className={`${styles.row} ${styles.passphrase} ${styles.tooltipContainer} summary-second-passphrase`}>
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
                    isSecondPassphrase={secondPassphrase.hasSecondPassphrase}
                    secondPPFeedback={secondPassphrase.feedback}
                    inputsLength={12}
                    maxInputsLength={24}
                    onFill={this.checkSecondPassphrase}
                  />
                </div>
              )
              : null
          }
        </div>

        <Box.Footer className="summary-footer">
          {this.props.account.hwInfo && this.props.account.hwInfo.deviceId ? null
            : (
              <React.Fragment>
                <PrimaryButton
                  className={`${styles.confirmBtn} on-nextStep send-button`}
                  onClick={this.submitTransaction}
                  disabled={
                    (secondPassphrase.hasSecondPassphrase
                      && !secondPassphrase.isValid)
                  }
                >
                  {this.getConfirmButtonLabel()}
                </PrimaryButton>
                <TertiaryButton className={`${styles.editBtn} on-prevStep`} onClick={this.prevStep}>
                  {t('Edit transaction')}
                </TertiaryButton>
              </React.Fragment>
            )}
        </Box.Footer>
      </Box>
    );
  }
}

export default Summary;
