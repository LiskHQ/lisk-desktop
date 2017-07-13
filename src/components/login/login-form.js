import React from 'react';
import { withRouter } from 'react-router';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import Button from 'react-toolbox/lib/button';
import { CardActions } from 'react-toolbox/lib/card';
import Checkbox from 'react-toolbox/lib/checkbox';
import { setActivePeer } from '../../utils/api/peers';
import store from '../../store';
import { accountUpdated } from '../../actions/account';
import { getAccount } from '../../utils/api/account';

/**
 * The container component containing login
 * and create account functionality
 */
class LoginForm extends React.Component {
  constructor() {
    super();
    this.networksRaw = [
      {
        name: 'Mainnet',
        ssl: true,
        port: 443,
      }, {
        name: 'Testnet',
        testnet: true,
      }, {
        name: 'Custom Node',
        custom: true,
        address: 'http://localhost:8000',
        // @todo this part is only used for development purpose.
        //   check if it should be separated
        testnet: true,
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      },
    ];

    this.networks = this.networksRaw.map((network, index) => ({
      label: network.name,
      value: index,
    }));

    this.state = {
      passphrase: '',
      address: '',
      network: 0,
    };
  }

  handleChange(value) {
    this.setState({ address: value });
  }

  validateUrl(value) {
    let addressValidity = '';
    try {
      const url = new URL(value);
      addressValidity = url && url.port !== '' ? '' : 'URL is invalid';
    } catch (e) {
      addressValidity = 'URL is invalid';
    }
    this.setState({ address: value, addressValidity });
  }

  changeHandler(field, value) {
    this.setState({ [field]: value });
  }

  onLoginSubmission() {
    // set active peer
    setActivePeer(store, this.state.network);

    // get account info
    store.dispatch(accountUpdated({ passphrase: this.state.passphrase }));
    const accountInfo = store.getState().account;
    // redirect to main/transactions
    getAccount(store.getState().peers.active, accountInfo.address).then((result) => {
      store.dispatch(accountUpdated(result));
      // redirect to main/transactions
      this.props.router.push('/main/transactions/');
    });
  }

  render() {
    return (
      <form>
        <Dropdown
          auto={false}
          source={this.networks}
          onChange={this.changeHandler.bind(this, 'network')}
          label='Select a network'
          value={this.state.network}
        />
        {
          this.state.network === 2 &&
          <Input type='text' label='Node address' name='address'
            value={this.state.address} error={this.state.addressValidity}
            onChange={this.validateUrl.bind(this)} />
        }
        <Input type={this.state.showPassphrase ? 'text' : 'password'}
          label='Enter your passphrase' name='passphrase'
          value={this.state.passphrase} onChange={this.changeHandler.bind(this, 'passphrase')} />
        <Checkbox
          checked={this.state.showPassphrase}
          label="Show passphrase"
          onChange={this.changeHandler.bind(this, 'showPassphrase')}
        />
        <CardActions>
          <Button label='NEW ACCOUNT' flat primary />
          <Button label='LOGIN' primary raised onClick={this.onLoginSubmission.bind(this)}
            disabled={this.state.network === 2 && this.state.addressValidity !== ''} />
        </CardActions>
      </form>
    );
  }
}

export default withRouter(LoginForm);
