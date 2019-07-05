import React from 'react';
import AccountVisual from '../../accountVisual/index';
import { fromRawLsk } from '../../../utils/lsk';
import PassphraseInputV2 from '../../passphraseInputV2/passphraseInputV2';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../../toolbox/buttons/button';
import { extractPublicKey } from '../../../utils/account';
import Fees from '../../../constants/fees';
import styles from './summary.css';

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      secondPassphrase: {
        error: false,
        feedback: '',
        hasSecondPassphrase: false,
        isValid: false,
        value: null,
      },
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.checkSecondPassphrase = this.checkSecondPassphrase.bind(this);
  }

  componentDidMount() {
    const { account } = this.props;

    // istanbul ignore else
    if (account.info && account.info.LSK.secondPublicKey) {
      this.setState({
        secondPassphrase: {
          ...this.state.secondPassphrase,
          hasSecondPassphrase: true,
        },
      });
    }
  }

  checkSecondPassphrase(passphrase, error) {
    const { account } = this.props;

    let feedback = error || '';
    const expectedPublicKey = !error && extractPublicKey(passphrase);
    const isPassphraseValid = account.info.LSK.secondPublicKey === expectedPublicKey;

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

  onSubmit() {
    const {
      account,
      nextStep,
      nickname,
      submitDelegateRegistration,
    } = this.props;
    const { secondPassphrase } = this.state;

    const data = {
      userInfo: {
        account: account.info.LSK,
        username: nickname,
        passphrase: account.passphrase,
        secondPassphrase: secondPassphrase.value,
      },
    };

    submitDelegateRegistration(data.userInfo);
    nextStep(data);
  }

  render() {
    const {
      account,
      nickname,
      prevStep,
      t,
    } = this.props;
    const { secondPassphrase } = this.state;

    return (
      <div className={`${styles.wrapper} summary-container`}>
        <header className={`${styles.header} summary-header`}>
          <h1>{t('Become a delegate summary')}</h1>
        </header>

        <div className={`${styles.content} summary-content`}>

          <div className={styles.row}>
            <label className={'nickname-label'}>{t('Your nickname')}</label>
            <div className={styles.userInformation}>
              <AccountVisual address={account.info.LSK.address} size={25} />
              <span className={`${styles.nickname} nickname`}>{nickname}</span>
              <span className={`${styles.address} address`}>{account.info.LSK.address}</span>
            </div>
          </div>

          <div className={styles.row}>
            <label>{t('Transaction fee')}</label>
            <span className={styles.feeInformation}>{t('{{fee}} LSK', { fee: fromRawLsk(Fees.registerDelegate) })}</span>
          </div>

          {
            secondPassphrase.hasSecondPassphrase
            ? <div className={`${styles.row} summary-second-passphrase`}>
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

        <footer className={'summary-footer'}>
          <PrimaryButtonV2
            className={`${styles.confirmBtn} confirm-button`}
            onClick={this.onSubmit}
            disabled={secondPassphrase.hasSecondPassphrase && !secondPassphrase.isValid}>
            {t('Become a delegate')}
          </PrimaryButtonV2>

          <TertiaryButtonV2
            className={`${styles.editBtn} cancel-button`}
            onClick={() => prevStep({ nickname })}>
            {t('Go back')}
          </TertiaryButtonV2>
        </footer>
      </div>
    );
  }
}

export default Summary;
