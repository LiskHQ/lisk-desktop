import React from 'react';
import to from 'await-to-js';
import AccountVisual from '../../accountVisual/index';
import { fromRawLsk } from '../../../utils/lsk';
import PassphraseInputV2 from '../../passphraseInputV2/passphraseInputV2';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../../toolbox/buttons/button';
import Tooltip from '../../toolbox/tooltip/tooltip';
import { extractPublicKey } from '../../../utils/account';
import Fees from '../../../constants/fees';
import { create } from '../../../utils/api/lsk/transactions';
import { createTransactionType } from '../../../constants/transactionTypes';
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
    if (account && account.secondPublicKey) {
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

  async onSubmit() {
    const {
      account,
      nextStep,
      nickname,
    } = this.props;
    const { secondPassphrase } = this.state;

    const data = {
      account,
      username: nickname,
      passphrase: account.passphrase,
      secondPassphrase: secondPassphrase.value,
    };

    const [error, tx] = await to(create(data, createTransactionType.delegate_registration));
    if (!error) nextStep({ transactionInfo: tx });
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
              <AccountVisual address={account.address} size={25} />
              <span className={`${styles.nickname} nickname`}>{nickname}</span>
              <span className={`${styles.address} address`}>{account.address}</span>
            </div>
          </div>

          <div className={styles.row}>
            <label>{t('Transaction fee')}</label>
            <span className={styles.feeInformation}>{t('{{fee}} LSK', { fee: fromRawLsk(Fees.registerDelegate) })}</span>
          </div>

          {
            secondPassphrase.hasSecondPassphrase
            ? <div className={`${styles.row} ${styles.tooltipContainer} summary-second-passphrase`}>
                <label>{t('Second passphrase')}</label>
                <Tooltip
                  className={`${styles.tooltip}`}
                  title={t('What is your second passphrase?')}>
                  <React.Fragment>
                    <p className={`${styles.tooltupText}`}>
                      {t('Second passphrase is an optional extra layer of protection to your account. You can register at anytime, but you can not remove it.')}
                    </p>
                    <p className={`${styles.tooltipText}`}>
                      {t('If you see this field, you have registered a second passphrase in past and it is required to confirm transactions.')}
                    </p>
                  </React.Fragment>
                </Tooltip>
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
