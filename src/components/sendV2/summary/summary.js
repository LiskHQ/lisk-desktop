import React from 'react';
import ConverterV2 from '../../converterV2';
import AccountVisual from '../../accountVisual/index';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../../toolbox/buttons/button';
import fees from '../../../constants/fees';
import LiskAmount from '../../liskAmount';
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
      secondPassphrase: {
        hasSecondPassphrase: false,
        isValid: '',
        feedback: '',
      },
    };

    this.prevStep = this.prevStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.checkSecondPassphrase = this.checkSecondPassphrase.bind(this);
  }

  componentDidMount() {
    const { account } = this.props;

    // istanbul ignore else
    if (account && account.secondPublicKey) {
      this.setState({
        secondPassphrase: {
          ...this.state.secondPassphrase,
          hasSecondPassphrase: true,
          isValid: false,
        },
      });
    }
  }

  checkSecondPassphrase(passphrase, error) {
    // istanbul ignore else
    if (!error) {
      const { account, t } = this.props;
      const expectedPublicKey = extractPublicKey(passphrase);
      const isPassphraseValid = account.secondPublicKey === expectedPublicKey;

      if (isPassphraseValid) {
        this.setState({
          secondPassphrase: {
            ...this.state.secondPassphrase,
            isValid: true,
            feedback: '',
          },
        });
      } else {
        this.setState({
          secondPassphrase: {
            ...this.state.secondPassphrase,
            isValid: false,
            feedback: t('Oops! Wrong passphrase'),
          },
        });
      }
    }
  }

  prevStep() {
    Piwik.trackingEvent('Send_Summary', 'button', 'Previous step');
    this.props.prevStep({ fields: { ...this.props.fields } });
  }

  nextStep() {
    Piwik.trackingEvent('Send_Summary', 'button', 'Next step');
    this.props.nextStep({ fields: { ...this.props.fields } });
  }

  render() {
    const { t, fields } = this.props;
    const { secondPassphrase } = this.state;
    const isBtnDisabled = secondPassphrase.isValid !== '' && !secondPassphrase.isValid;

    return (
      <div className={`${styles.wrapper} summary`}>
        <header className={`${styles.header} summary-header`}>
          <h1>{t('Transaction summary')}</h1>
        </header>

        <div className={`${styles.content} summary-content`}>
          <div className={styles.row}>
            <label>{t('Recipient')}</label>
            <div className={styles.account}>
              <AccountVisual address={fields.recipient.address} size={25} />
              <label className={styles.information}>
                {fields.recipient.title || fields.recipient.address}
              </label>
              <span className={`${styles.secondText} ${styles.accountSecondText}`}>
                {fields.recipient.addres}
              </span>
            </div>
          </div>

          <div className={styles.row}>
            <label>{t('Amount of transaction')}</label>
            <label className={`${styles.information} ${styles.amount}`}>
              {`${fields.amount.value} ${t('LSK')}`}
              <ConverterV2 className={`${styles.secondText} ${styles.amountSecondText}`} value={fields.amount.value} />
            </label>
          </div>

          <div className={styles.row}>
            <label>{t('Message')}</label>
            <p className={styles.information}>{t(fields.reference.value)}</p>
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
          <SecondaryButtonV2 className={`${styles.btn} on-prevStep`} onClick={this.prevStep}>
            {t('Edit transaction')}
          </SecondaryButtonV2>

          <div className={styles.feeMessage}>
            <label>
              {t('Transaction fee')}
              <Tooltip
                className={'showOnTop'}
                title={'Transaction fee'}
                footer={
                  <a href={links.transactionFee}
                    rel="noopener noreferrer"
                    target="_blank">
                      {t('Read More')}
                  </a>
                }
              >
                <p>
                {
                  t(`Every transaction needs to be confirmed and forged into Lisks blockchain network. 
                  Such operations require hardware resources and because of that we ask for a small fee for processing those.`)
                }
                </p>
              </Tooltip>
            </label>
            <span><LiskAmount val={fees.send}/> {t('LSK')}</span>
          </div>

          <PrimaryButtonV2
            className={`${styles.btn} on-nextStep`}
            onClick={this.nextStep}
            disabled={isBtnDisabled}>
            {t('Send {{value}} LSK', { value: fields.amount.value })}
          </PrimaryButtonV2>
        </footer>
      </div>
    );
  }
}

export default Summary;
