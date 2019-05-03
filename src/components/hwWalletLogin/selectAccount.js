import React from 'react';
// import { Link } from 'react-router-dom';
import { TertiaryButtonV2 } from '../toolbox/buttons/button';
// import { models } from '../../constants/hwConstants';
// import svgIcons from '../../utils/svgIcons';
import { displayAccounts } from '../../utils/ledger';
import { loginType } from '../../constants/hwConstants';
import styles from './selectDevice.css';

class SelectAccount extends React.Component {
  constructor(props) {
    super(props);

    this.getAccountsFromDevice = this.getAccountsFromDevice.bind(this);
  }

  componentDidMount() {
    this.getAccountsFromDevice();
  }

  async getAccountsFromDevice() {
    const { device, liskAPIClient, t } = this.props;
    const hwAccounts = await displayAccounts({
      liskAPIClient,
      loginType: device.model.contains('Ledger') ? loginType.ledger : loginType.trezor,
      hwAccounts: [],
      t,
      device,
    });
    console.log(hwAccounts);
    return hwAccounts;
  }

  render() {
    const { t, device, prevStep } = this.props;
    return <React.Fragment>
      <h1>{t('Lisk accounts on {{WalletModel}}', { WalletModel: device.model })}</h1>
      <p>{t('Please select the account you’d like to sign in to or')}</p>

      <div className={`${styles.deviceContainer} hw-container`}>
      </div>

      <TertiaryButtonV2 onClick={() => prevStep({ jump: 2 })}>
        {t('Go Back')}
      </TertiaryButtonV2>
    </React.Fragment>;
  }
}

export default SelectAccount;
