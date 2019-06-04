import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from '../multiStep';
import styles from './signMessage.css';
import SignMessageInput from './signMessageInput';
import ConfirmMessage from './confirmMessage';

class SignMessage extends React.Component {
  render() {
    const { account, t, history } = this.props;
    return (
      <section className={`${styles.wrapper} ${grid.row}`}>
        <MultiStep className={grid['col-sm-8']}>
          <SignMessageInput t={t} history={history} />
          <ConfirmMessage t={t} account={account} />
        </MultiStep>
      </section>
    );
  }
}

export default SignMessage;
