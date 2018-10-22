import React from 'react';
import Box from '../box';
import UnlockWallet from './unlockWallet';
import LedgerLogin from './ledgerLogin';

class Ledger extends React.Component {
  constructor() {
    super();
    this.state = {
      showAccounts: true,
    };
  }

  handleOnClick() {
    this.setState({
      showAccounts: true,
    });
  }

  render() {
    if (this.state.showAccounts) {
      return (
        <Box>
          <LedgerLogin loginType={0} network={this.props.network} />
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
