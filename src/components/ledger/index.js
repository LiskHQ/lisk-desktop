import React from 'react';
import Box from '../box';
import UnlockWallet from './unlockWallet';
import LedgerLogin from './ledgerLogin';
import MultiStep from '../multiStep/index';

class Ledger extends React.Component {
  constructor() {
    super();
    this.state = {
      showAccounts: false,
    };
  }

  handleOnClick() {
    this.setState({
      showAccounts: true,
    })
  }

  render() {
    if (this.state.showAccounts) {
      return (<Box>
        <LedgerLogin loginType={0} />
      </Box>)
    }
    return <Box>
      <UnlockWallet handleOnClick={this.handleOnClick.bind(this)}/>
    </Box>;
  }
};

export default Ledger;
