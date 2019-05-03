import React from 'react';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import AccountVisual from '../accountVisual';
import LiskAmount from '../liskAmount';
import { displayAccounts } from '../../utils/ledger';
import { loginType } from '../../constants/hwConstants';
import styles from './selectAccount.css';

class SelectAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeDevice: null,
    };

    this.getAccountsFromDevice = this.getAccountsFromDevice.bind(this);
  }

  componentDidMount() {
    this.getAccountsFromDevice();
  }

  async getAccountsFromDevice() {
    const { device, liskAPIClient, t } = this.props;
    let activeDevice = '';

    setTimeout(async () => {
      activeDevice = await displayAccounts({
        liskAPIClient,
        loginType: /trezor/ig.test(device.deviceModel) ? loginType.trezor : loginType.ledger,
        hwAccounts: [],
        t,
        device,
      });

      this.setState({ activeDevice: { ...activeDevice } });
    }, 2000);
  }

  render() {
    const { t, prevStep } = this.props;
    const { activeDevice } = this.state;

    return <React.Fragment>
      <h1>{t('Lisk accounts on {{WalletModel}}', { WalletModel: 'Trezor Model T' })}</h1>
      <p>{t('Please select the account you’d like to sign in to or')}</p>

      <div className={`${styles.deviceContainer} hw-container`}>
        {
          activeDevice !== null
          ? activeDevice.hwAccounts.map(account => (
            <div key={account.address} className={`${styles.account} hw-account`}>
              <header className={styles.header}>
                <input value={'Unnamed account'} className={styles.title} />
              </header>

              <div className={styles.content}>
                <AccountVisual
                  address={account.address || ''}
                  size={55}
                />
                <div className={styles.row}>
                  <p>{account.address}</p>
                  <span>{t('Address')}</span>
                </div>
                <div className={styles.row}>
                  <p><LiskAmount val={account.balance} /> {t(' LSK')}</p>
                  <span>{t('Balance')}</span>
                </div>

                <PrimaryButtonV2>{t('Select this account')}</PrimaryButtonV2>
              </div>
            </div>
          ))
          : null
        }
      </div>

      <TertiaryButtonV2 onClick={() => prevStep({ jump: 2 })}>
        {t('Go Back')}
      </TertiaryButtonV2>
    </React.Fragment>;
  }
}

export default SelectAccount;
