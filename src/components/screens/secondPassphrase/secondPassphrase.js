import React from 'react';
import { generatePassphrase } from '../../../utils/passphrase';
import FirstStep from './firstStep';
import SummaryStep from './summaryStep';
import styles from './secondPassphrase.css';
import ConfirmPassphrase from './confirmPassphrase';
import TransactionResult from '../../shared/transactionResult';
import MultiStep from '../../../../libs/multiStep';
import Dialog from '../../toolbox/dialog/dialog';

class SecondPassphrase extends React.Component {
  constructor() {
    super();

    this.secondPassphrase = generatePassphrase();
  }


  componentDidMount() {
    const { account, location, history } = this.props;
    if (account.secondPublicKey || account.balance < 5e8) {
      history.push(`${location.pathname}?modal=settings`);
    }
  }

  render() {
    const { t, account, secondPassphraseRegistered } = this.props;
    return (
      <Dialog hasClose className={styles.wrapper}>
        <MultiStep>
          <FirstStep
            t={t}
            account={{
              ...account,
              passphrase: this.secondPassphrase,
            }}
          />
          <ConfirmPassphrase
            t={t}
            passphrase={this.secondPassphrase}
          />
          <SummaryStep
            secondPassphrase={this.secondPassphrase}
            secondPassphraseRegistered={secondPassphraseRegistered}
            account={account}
            t={t}
          />
          <TransactionResult t={t} />
        </MultiStep>
      </Dialog>
    );
  }
}

export default SecondPassphrase;
