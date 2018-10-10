import React from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import styles from '../create/create.css';
import ProgressBarTheme from './progressBar.css';
import TransitionWrapper from '../../toolbox/transitionWrapper';
import { PrimaryButton } from '../../toolbox/buttons/button';
import { fromRawLsk } from '../../../utils/lsk';
import fees from '../../../constants/fees';

class Create extends React.Component {
  constructor() {
    super();
    this.state = { step: 'info' };
  }

  next() {
    this.props.addEventListener();
    this.setState({ step: 'generate' });
  }

  render() {
    const {
      t, balance, percentage, hintTitle,
    } = this.props;
    const hasFund = fromRawLsk(balance) * 1 < fromRawLsk(fees.setSecondPassphrase) * 1;

    return (
      <div>
        <TransitionWrapper current={this.state.step} step='info'>
          <div className={styles.secondPassphrase}
            ref={ (pageRoot) => { this.pageRoot = pageRoot; } }>
            <header>
              <h2 className={`${styles.generatorHeader}`}
                id="generatorHeader" >
                {t('Secure the use of your Lisk ID')}
                <br />
                {t('with a second passphrase')}
              </h2>
            </header>
            <p className={styles.info}>
              {t('After registration, your second passphrase will be required when confirming every transaction and every vote.')}
              <br />
              {t('You are responsible for safekeeping your second passphrase. No one can restore it, not even Lisk.')}
            </p>
            <PrimaryButton
              className={`${styles.nextButton} next`}
              disabled={hasFund}
              label={t('Next')}
              onClick={this.next.bind(this)}
              type={'button'} />
            {hasFund ? <p className={styles.error}>
              {t('Insufficient funds (Fee: {{fee}} LSK)', { fee: fromRawLsk(fees.setSecondPassphrase) })}
            </p> : '' }
          </div>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='generate'>
          <div className={`${styles.secondPassphrase} secondPassphrase`}
            ref={ (pageRoot) => { this.pageRoot = pageRoot; } }>
            <header>
              <h2 className={`${styles.generatorHeader}`}
                id="generatorHeader" >
                {t('Create your second passphrase')}
                <br/>
                {hintTitle}
              </h2>
            </header>
            <ProgressBar
              className='progress-bar'
              theme={ProgressBarTheme}
              mode='determinate'
              value={percentage} />
          </div>
        </TransitionWrapper>
      </div>);
  }
}

export default Create;
