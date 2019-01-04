import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import { generatePassphrase } from '../../utils/passphrase';
import { extractAddress } from '../../utils/account';
import ChooseAvatar from './chooseAvatar';
import HeaderV2 from '../headerV2/headerV2';
import styles from './registerV2.css';

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
    const { t } = this.props;
    return (
      <React.Fragment>
        <HeaderV2 showSettings={false} />
        <div className={`${styles.register} ${grid.row}`}>
          <div className={`${styles.wrapper} ${grid['col-sm-8']}`}>
            <span className={`${styles.stepsLabel}`}>{t('Step 1 / 4')}</span>
            <ChooseAvatar
              accounts={this.state.accounts}
              selected={this.state.selectedAccount}
              handleSelectAvatar={this.handleSelectAvatar}
              />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(RegisterV2);
