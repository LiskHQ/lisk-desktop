import React from 'react';

import { generatePassphrase } from '../../utils/passphrase';
import FirstStep from './firstStep';
import MultiStep from '../multiStep';
import SummaryStep from './summaryStep';
import routes from '../../constants/routes';
import styles from './secondPassphrase.css';

class SecondPassphrase extends React.Component {
  constructor() {
    super();

    const crypotObj = window.crypto || window.msCrypto;
    this.passphrase = generatePassphrase({
      seed: [...crypotObj.getRandomValues(new Uint16Array(16))].map(x => (`00${(x % 256).toString(16)}`).slice(-2)),
    });
    this.backToPreviousPage = this.backToPreviousPage.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    document.body.classList.remove('contentFocused');
  }

  componentDidMount() {
    document.body.classList.add('contentFocused');
    if (this.props.account.info.LSK.secondPublicKey) {
      this.props.history.push(`${routes.dashboard.path}`);
    }
  }

  backToPreviousPage() {
    this.props.history.goBack();
  }

  render() {
    const { t, account } = this.props;
    return (
      <div className={styles.wrapper}>
        <MultiStep showNav={false}>
          <FirstStep
            t={t}
            goBack={this.backToPreviousPage}
            account={{
              ...account,
              passphrase: this.passphrase,
            }}
          />
          <SummaryStep t={t} />
        </MultiStep>
      </div>
    );
  }
}

export default SecondPassphrase;
