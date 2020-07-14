import React from 'react';
import { generatePassphrase } from '../../../utils/passphrase';
import Fees from '../../../constants/fees';
import FirstStep from './firstStep';
import SummaryStep from './summaryStep';
import styles from './secondPassphrase.css';
import ConfirmPassphrase from './confirmPassphrase';
import TransactionResult from '../../shared/transactionResult';
import MultiStep from '../../../../libs/multiStep';
import Dialog from '../../toolbox/dialog/dialog';
import DialogHolder from '../../toolbox/dialog/holder';

class SecondPassphrase extends React.Component {
  constructor() {
    super();

    this.secondPassphrase = generatePassphrase();
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    document.body.classList.remove('contentFocused');
  }

  componentDidMount() {
    const { account } = this.props;
    document.body.classList.add('contentFocused');
    if (account.secondPublicKey || account.balance < Fees.setSecondPassphrase) {
      DialogHolder.hideDialog();
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
