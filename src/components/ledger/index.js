import React from 'react';
import Box from '../box';
import UnlockWallet from '../hwWallet/unlockWallet';
import LedgerLogin from '../hwWallet/ledgerLogin';
import styles from '../hwWallet/unlockWallet.css';

class Ledger extends React.Component {
  handleOnClick() {
    this.props.ledgerLogin();
  }

  render() {
    if (this.props.isLedgerLogin) {
      return (
          <Box>
            <LedgerLogin
              network={this.props.network}
              cancelLedgerLogin={this.props.cancelLedgerLogin} />
          </Box>);
    }

    return (
      <Box className={styles.unlockWallet}>
        <UnlockWallet
          handleOnClick={this.handleOnClick.bind(this)}
          cancelLedgerLogin={this.props.cancelLedgerLogin} />
      </Box>);
  }
}

export default Ledger;
