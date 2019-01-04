import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generatePassphrase } from '../../utils/passphrase';
import { extractAddress } from '../../utils/account';
import ChooseAvatar from './chooseAvatar';
import BackupPassphrase from './backupPassphrase';
import HeaderV2 from '../headerV2/headerV2';
import styles from './registerV2.css';
import MultiStep from '../multiStep';

class RegisterV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      selectedAccount: {},
    };

    this.handleSelectAvatar = this.handleSelectAvatar.bind(this);
  }

  componentDidMount() {
    /* istanbul ignore next */
    const crypotObj = window.crypto || window.msCrypto;
    const passphrases = [...Array(5)].map(() =>
      generatePassphrase({
        seed: [...crypotObj.getRandomValues(new Uint16Array(16))].map(x => (`00${(x % 256).toString(16)}`).slice(-2)),
      }));
    const accounts = passphrases.map(pass => ({
      address: extractAddress(pass),
      passphrase: pass,
    }));
    this.setState({
      accounts,
    });
  }

  handleSelectAvatar(selectedAccount) {
    this.setState({
      selectedAccount,
    });
  }

  render() {
    return (
      <React.Fragment>
        <HeaderV2 showSettings={false} />
        <div className={`${styles.register} ${grid.row}`}>
          <MultiStep
            className={`${styles.wrapper} ${grid['col-sm-8']}`}
            finalCallback={() => null}>
            <ChooseAvatar
              accounts={this.state.accounts}
              selected={this.state.selectedAccount}
              handleSelectAvatar={this.handleSelectAvatar} />
            <BackupPassphrase
              account={this.state.selectedAccount} />
          </MultiStep>
        </div>
      </React.Fragment>
    );
  }
}

export default RegisterV2;
