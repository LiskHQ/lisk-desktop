import React from 'react';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import Illustration from '../toolbox/illustration';
import PassphraseInputV2 from '../passphraseInputV2/passphraseInputV2';
import { extractPublicKey } from '../../utils/account';
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
    this.getHwWalletIllustration = this.getHwWalletIllustration.bind(this);
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

  getHwWalletIllustration() {
    return {
      'Trezor Model T': 'trezorLight',
      'Ledger Nano S': 'ledgerNanoLight',
    }[this.props.account.hwInfo.deviceModel];
  }

  render() {
    const {
      title, children, confirmButton, cancelButton, account, t, fee,
    } = this.props;
    const {
      secondPassphrase, isHardwareWalletConnected,
    } = this.state;
    return <div className={styles.wrapper}>
    <header className='summary-header'>
      { isHardwareWalletConnected ?
        <React.Fragment>
          <h1> {t('Confirm transaction on your {{deviceModel}}', { deviceModel: account.hwInfo.deviceModel })} </h1>
          <p>{t('Please check if all the transaction details are correct.')}</p>
          <Illustration name={this.getHwWalletIllustration()} />
        </React.Fragment> : null }
      <h2>{title}</h2>
    </header>
    <div className={styles.content}>
      {children}
      {account.secondPublicKey ?
        <section className='summary-second-passphrase'>
          <label>{t('Second passphrase')}</label>
          <PassphraseInputV2
            isSecondPassphrase={!!account.secondPublicKey}
            secondPPFeedback={secondPassphrase.feedback}
            inputsLength={12}
            maxInputsLength={24}
            onFill={this.checkSecondPassphrase} />
        </section>
        : null
      }
      <section>
        <label>
          {t('Transaction fee')}
          <Tooltip
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
        <label> {fee } LSK </label>
      </section>
    </div>
    <footer className='summary-footer'>
      {isHardwareWalletConnected ?
        null :
        <PrimaryButtonV2
          className={`${styles.confirmBtn} confirm-button`}
          disabled={
            (!!account.secondPublicKey && !secondPassphrase.isValid) ||
            confirmButton.disabled}
          onClick={this.confirmOnClick}>
          {confirmButton.label}
        </PrimaryButtonV2>
      }
      <TertiaryButtonV2
        className={`${styles.editBtn} cancel-button`}
        onClick={cancelButton.onClick}>
        {cancelButton.label}
      </TertiaryButtonV2>
    </footer>
  </div>;
  }
}

export default TransactionSummary;
