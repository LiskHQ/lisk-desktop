/* istanbul ignore file */
import React from 'react';
import ConverterV2 from '../../converterV2';
import AccountVisual from '../../accountVisual/index';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../../toolbox/buttons/button';
import fees from '../../../constants/fees';
import LiskAmount from '../../liskAmount';
import svg from '../../../utils/svgIcons';
import Piwik from '../../../utils/piwik';
import styles from './summary.css';

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.prevStep = this.prevStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  prevStep() {
    Piwik.trackingEvent('Send_Summary', 'button', 'Previous step');
    this.props.prevStep({ fields: { ...this.props.fields } });
  }

  nextStep() {
    Piwik.trackingEvent('Send_Summary', 'button', 'Next step');
    this.props.nextStep({ fields: { ...this.props.fields } });
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    const { t, fields } = this.props;

    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1>{t('Transaction summary')}</h1>
        </header>

        <div className={styles.content}>
          <div className={styles.row}>
            <label>{t('Recipient')}</label>
            <div className={styles.account}>
              <AccountVisual address={fields.recipient.address} size={25} />
              <label className={styles.information}>
                {t(fields.recipient.title || fields.recipient.address)}
              </label>
              <span className={`${styles.secondText} ${styles.accountSecondText}`}>
                {t(fields.recipient.address)}
              </span>
            </div>
          </div>

          <div className={styles.row}>
            <label>{t('Amount of transaction')}</label>
            <label className={`${styles.information} ${styles.amount}`}>
              {t(`${fields.amount.value} LSK`)}
              <ConverterV2 className={`${styles.secondText} ${styles.amountSecondText}`} value={fields.amount.value} />
            </label>
          </div>

          <div className={styles.row}>
            <label>{t('Message')}</label>
            <p className={styles.information}>{t(fields.reference.value)}</p>
          </div>
        </div>

        <footer className={styles.footer}>
          <SecondaryButtonV2 className={styles.btn} onClick={this.prevStep}>
            {t('Edit transaction')}
          </SecondaryButtonV2>

          <div className={styles.feeMessage}>
            <label>{t('Transaction fee')} <img src={svg.question_icon}/></label>
            <span><LiskAmount val={fees.send}/> {t('LSK')}</span>
          </div>

          <PrimaryButtonV2 className={styles.btn} onClick={this.nextStep}>
            {t(`Send ${fields.amount.value} LSK`)}
          </PrimaryButtonV2>
        </footer>
      </div>
    );
  }
}

export default Summary;
