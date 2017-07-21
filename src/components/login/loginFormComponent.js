import React from 'react';
import Cookies from 'js-cookie';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import Button from 'react-toolbox/lib/button';
import Checkbox from 'react-toolbox/lib/checkbox';
import { getAccount } from '../../utils/api/account';
import networksRaw from './networks';

if (global._bitcore) delete global._bitcore;

const mnemonic = require('bitcore-mnemonic');

/**
 * The container component containing login
 * and create account functionality
 */
class LoginFormComponent extends React.Component {
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

  componentDidMount() {
    // pre-fill passphrase and address if exiting in cookies
    this.devPreFill();
  }

  validateUrl(value) {
    const addHttp = (url) => {
      const reg = /^(?:f|ht)tps?:\/\//i;
      return reg.test(url) ? url : `http://${url}`;
    };

    let addressValidity = '';
    try {
      const url = new URL(addHttp(value));
      addressValidity = url && url.port !== '' ? '' : 'URL is invalid';
    } catch (e) {
      addressValidity = 'URL is invalid';
    }

    const data = { address: value, addressValidity };
    this.setState(data);
    return data;
  }

  validatePassphrase(value) {
    const data = { passphrase: value };
    if (!value || value === '') {
      data.passphraseValidity = 'Empty passphrase';
    } else {
      const normalizedValue = value.replace(/ +/g, ' ').trim().toLowerCase();
      if (normalizedValue.split(' ').length < 12 || !mnemonic.isValid(normalizedValue)) {
        data.passphraseValidity = 'Invalid passphrase';
      } else {
        data.passphraseValidity = '';
      }
    }

    this.setState(data);
    return data;
  }

  changeHandler(name, value) {
    this.setState({ [name]: value });
  }

  onLoginSubmission() {
    const network = Object.assign({}, networksRaw[this.state.network]);
    if (this.state.network === 2) {
      network.address = this.state.address;
    }
    // set active peer
    this.props.activePeerSet(network);

    setTimeout(() => {
      // get account info
      const { onAccountUpdated } = this.props;
      onAccountUpdated({ passphrase: this.state.passphrase });
      const accountInfo = this.props.account;

      // redirect to main/transactions
      getAccount(this.props.peers.data, accountInfo.address).then((result) => {
        onAccountUpdated(result);
        // redirect to main/transactions
        this.props.history.push('/main/transactions');
      });
    }, 5);
  }

  devPreFill() {
    const address = Cookies.get('address');
    const passphrase = Cookies.get('passphrase');

    this.setState({ network: address ? 2 : 0 });
    this.validateUrl(address);
    this.validatePassphrase(passphrase);
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
          error={this.state.passphraseValidity === 'Invalid passphrase' ? 'Invalid passphrase' : ''}
          value={this.state.passphrase} onChange={this.validatePassphrase.bind(this)} />
        <Checkbox
          checked={this.state.showPassphrase}
          label="Show passphrase"
          className={grid['start-xs']}
          onChange={this.changeHandler.bind(this, 'showPassphrase')}
        />
        <footer className={ `${grid.row} ${grid['center-xs']}` }>
          <div className={grid['col-xs-12']}>
            <Button label='NEW ACCOUNT' flat primary />
            <Button label='LOGIN' primary raised onClick={this.onLoginSubmission.bind(this)}
              disabled={(this.state.network === 2 && this.state.addressValidity !== '') ||
              this.state.passphraseValidity !== ''} />
          </div>
        </footer>
      </form>
    );
  }
}

export default LoginFormComponent;
