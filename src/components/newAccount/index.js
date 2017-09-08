import React from 'react';
import Passphrase from '../passphrase';
import networksRaw from '../login/networks';

class NewAccount extends React.Component {
  constructor() {
    super();

    this.networks = networksRaw.map((network, index) => ({
      label: network.name,
      value: index,
    }));

    this.state = {
      passphrase: '',
      address: '',
      network: 0,
    };
  }
  onPassGenerated(passphrase) {
    const network = Object.assign({}, networksRaw[this.state.network]);
    if (this.state.network === 2) {
      network.address = this.state.address;
    }

    // set active peer
    this.props.activePeerSet({
      passphrase,
      network,
    });
  }

  render() {
    return (
      <Passphrase
        onPassGenerated={this.onPassGenerated.bind(this)}/>
    );
  }
}

export default NewAccount;
