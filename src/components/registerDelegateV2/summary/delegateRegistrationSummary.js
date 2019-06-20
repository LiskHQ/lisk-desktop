import React from 'react';
import Box from '../../boxV2';
import AccountVisual from '../../accountVisual/index';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../../toolbox/buttons/button';
import PassphraseInputV2 from '../../passphraseInputV2/passphraseInputV2';
import { fromRawLsk } from '../../../utils/lsk';
import Fees from '../../../constants/fees';
import { extractPublicKey } from '../../../utils/account';
import styles from './summary.css';

class DelegateRegistrationSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      secondPassphrase: {
        hasSecondPassphrase: false,
        isValid: false,
        feedback: '',
        value: null,
      },
    };

    this.checkSecondPassphrase = this.checkSecondPassphrase.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { account } = this.props;
    this.setState({
      secondPassphrase: {
        ...this.state,
        hasSecondPassphrase: account.secondPublicKey.length !== 0,
      },
    });
  }

  checkSecondPassphrase(passphrase, error) {
    const { account } = this.props;

    let feedback = error || '';
    const expectedPublicKey = !error && extractPublicKey(passphrase);
    const isPassphraseValid = account.secondPublicKey === expectedPublicKey;

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
    const { secondPassphrase } = this.state;
    const {
      account, nickname, delegateRegistered, nextStep,
    } = this.props;

    delegateRegistered({
      account: account.info.LSK,
      username: nickname,
      passphrase: account.passphrase,
      secondPassphrase: secondPassphrase.value,
    });

    nextStep();
  }

  render() {
    const { secondPassphrase } = this.state;
    const {
      t, nickname, account, prevStep,
    } = this.props;
    const isConfirmBtnDisabled = (secondPassphrase.hasSecondPassphrase &&
      !secondPassphrase.isValid);

    return (
      <Box className={styles.box}>
        <header>
          <h1>{t('Become a delegate summary')}</h1>
        </header>

        <div className={styles.container}>
          <label>{t('Your nickname')}</label>
          <div className={styles.userInformation}>
            <AccountVisual
              className={styles.accountVisual}
              address={account.info.LSK.address}
              size={23}
            />
            <span>{nickname}</span>
            <span>{account.info.LSK.address}</span>
          </div>

          <label>{t('Transaction fee')}</label>
          <div className={styles.feeDetails}>
            <span>{`${fromRawLsk(Fees.registerDelegate)} LSK`}</span>
          </div>

          {
            secondPassphrase.hasSecondPassphrase
            ? <div className={`${styles.passphrase} summary-second-passphrase`}>
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

        <footer>
            <PrimaryButtonV2
              disabled={isConfirmBtnDisabled}
              onClick={this.onSubmit}
              className={`${styles.confirmBtn} confirm-btn`}>
              {t('Become a delegate')}
            </PrimaryButtonV2>

            <TertiaryButtonV2
              className={`${styles.confirmBtn} go-back-btn`}
              onClick={() => prevStep({ nickname })}>
              {t('Go back')}
            </TertiaryButtonV2>
          </footer>
      </Box>
    );
  }
}

export default DelegateRegistrationSummary;
