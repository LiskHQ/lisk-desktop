import React from 'react';

import FirstStep from './firstStep';
import MultiStep from '../multiStep';
import SummaryStep from './summaryStep';
import routes from '../../constants/routes';
import styles from './secondPassphrase.css';

class SecondPassphrase extends React.Component {
  constructor() {
    super();

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
    const { t } = this.props;
    return (
      <div className={styles.wrapper}>
        <MultiStep showNav={false}>
          <FirstStep t={t} goBack={this.backToPreviousPage} />
          <SummaryStep t={t} />
        </MultiStep>
      </div>
    );
  }
}

export default SecondPassphrase;
