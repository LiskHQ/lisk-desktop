import React from 'react';
import TransitionWrapper from '../../../toolbox/transitionWrapper';
import Fees from '../../../../constants/fees';
import { fromRawLsk } from '../../../../utils/lsk';
import { PrimaryButton } from '../../../toolbox/buttons/button';
import { authStateIsValid } from '../../../../utils/form';

import styles from './choose.css';

class Choose extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'choose',
    };
  }

  checkSufficientFunds(evt) {
    if (!authStateIsValid(this.state)) {
      evt.preventDefault();
    }

    this.props.nextStep({
    });
  }

  render() {
    const { t } = this.props;
    const hasEnoughLSK = (fromRawLsk(this.props.account.balance) * 1
      > fromRawLsk(Fees.registerDelegate) * 1);
    const isDelegate = this.props.account.isDelegate;
    return (
      <section>
        <div>
          <TransitionWrapper current={this.state.step} step='choose'>
            <div className={styles.stepContainer}>
              <header>
                <h5 className={styles.stepHeading}>
                  {t('Be a delegate')}
                </h5>
              </header>
              <p className={styles.stepDescription}>
                {t('Delegates have great responsibility within the Lisk system, securing the blockchain. Becoming a delegate requires the registration of a name. The top 101 delegates are eligible to forge.')}
              </p>
              <div>
                <form onSubmit={this.checkSufficientFunds.bind(this)}>
                  <PrimaryButton
                    disabled={!hasEnoughLSK || isDelegate}
                    label={t('Choose a name')}
                    className={`${styles.chooseNameBtn} choose-name`}
                    onClick={this.checkSufficientFunds.bind(this)}
                  />
                  {!hasEnoughLSK ? <p className={styles.stepError}>
                    {t('Insufficient funds (Fee: {{fee}} LSK)', { fee: fromRawLsk(Fees.registerDelegate) })}
                  </p> : null }
                  {isDelegate ? <p className={styles.stepError}>
                    {t('You have already registered as a delegate.')}
                  </p> : null }
                </form>
              </div>
              <footer>
              </footer>
            </div>
          </TransitionWrapper>
          <TransitionWrapper current={this.state.step} step='confirm'>
            <div>
              <h5>
                {t('Confirm')}
              </h5>
            </div>
          </TransitionWrapper>
        </div>
      </section>
    );
  }
}
export default Choose;
