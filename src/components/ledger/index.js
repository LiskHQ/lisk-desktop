import React from 'react';
import Box from '../box';
import UnlockWallet from './unlockWallet';
import LedgerLogin from './ledgerLogin';

class Ledger extends React.Component {
  handleOnClick() {
    this.props.ledgerLogin();
  }

  render() {
    if (this.props.isLedgerLogin) {
      return (
          <Box>
            <LedgerLogin
              loginType={0}
              network={this.props.network}
              cancelLedgerLogin={this.props.cancelLedgerLogin} />
          </Box>);
    }

    return (
      <Box>
        <UnlockWallet
          handleOnClick={this.handleOnClick.bind(this)}
          cancelLedgerLogin={this.props.cancelLedgerLogin} />
      </Box>);
  }
}

export default Ledger;
