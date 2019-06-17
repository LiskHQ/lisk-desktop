import React from 'react';

import MultiStep from '../multiStep';
import routes from '../../constants/routes';

import styles from './secondPassphrase.css';

class SecondPassphrase extends React.Component {
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
    const { account } = this.props;
    return (
      <div className={styles.wrapper}>
        <MultiStep>
          <h1>TODO</h1>
          {account.address}
        </MultiStep>
      </div>
    );
  }
}

export default SecondPassphrase;
