import React from 'react';
import { toast } from 'react-toastify';
import { tokenMap } from '../../../constants/tokens';
import { isEmpty } from '../../../utils/helpers';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxContent from '../../toolbox/box/content';
import CheckBox from '../../toolbox/checkBox';
import Piwik from '../../../utils/piwik';
import SecondPassphraseSetting from './secondPassphrase';
import Select from '../../toolbox/select';
import links from '../../../constants/externalLinks';
import settingsConst from '../../../constants/settings';
import transactionTypes from '../../../constants/transactionTypes';
import Dialog from '../../toolbox/dialog/dialog';
import { Input } from '../../toolbox/inputs';
import styles from './settings.css';

class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      currencies: settingsConst.currencies,
    };

    this.setCurrency = this.setCurrency.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.toggleAutoLog = this.toggleAutoLog.bind(this);
    this.handleTokenToggle = this.handleTokenToggle.bind(this);
    this.setServiceBaseURL = this.setServiceBaseURL.bind(this);
  }

  handleTokenToggle({ target: { name } }) {
    const { settings } = this.props;
    const newSettings = {
      token: { list: { [name]: !settings.token.list[name] } },
    };
    this.onUpdateSettings(newSettings);
  }

  toggleAutoLog({ target }) {
    Piwik.trackingEvent('Settings', 'button', 'Toggle autoLog');
    const {
      account, timerReset,
    } = this.props;
    if (target && account.passphrase) {
      timerReset(new Date());
    }
    this.handleCheckboxChange({ target });
  }

  setCurrency(currency) {
    const { settings } = this.props;
    if (settings.currency !== currency) this.onUpdateSettings({ currency });
  }

  setServiceBaseURL(e) {
    e.preventDefault();
    const serviceBaseURL = e.target.value;
    this.props.serviceUrlSet(serviceBaseURL);
  }

  handleCheckboxChange({ target: { name } }) {
    const { settings } = this.props;
    this.onUpdateSettings({ [name]: !settings[name] });
  }

  onUpdateSettings(newSettings) {
    const { settingsUpdated, t } = this.props;
    Piwik.trackingEvent('Settings', 'button', 'Update settings');
    settingsUpdated(newSettings);
    toast(t('Settings saved!'));
  }

  render() {
    const {
      t, settings,
      transactions: { pending },
      account,
    } = this.props;
    const { currencies } = this.state;

    const isHardwareWalletAccount = account.hwInfo && !!account.hwInfo.deviceId;
    const activeCurrency = settings.currency || settingsConst.currencies[0];
    const hasPendingSecondPassphrase = pending.find(element =>
      element.type === transactionTypes().setSecondPassphrase.code) !== undefined;

    return (
      <Dialog hasClose className={styles.dialogWrapper}>
        <Box className={styles.wrapper}>
          <BoxHeader>
            <h1>{t('Settings')}</h1>
          </BoxHeader>
          <BoxContent className={styles.content}>
            <section>
              <h2>{t('Service')}</h2>
              <div className={styles.fieldGroup}>
                <span className={styles.labelName}>{t('base URL')}</span>
                <Input onChange={this.setServiceBaseURL} placeholder={this.props.serviceUrl} />
              </div>
            </section>
            <section>
              <h2>{t('Locale')}</h2>
              <div className={styles.fieldGroup}>
                <span className={styles.labelName}>{t('Currency')}</span>
                <Select
                  options={currencies.map(currency => ({
                    label: currency, value: currency,
                  }))}
                  selected={activeCurrency}
                  onChange={this.setCurrency}
                  className="currency"
                  placeholder="Currency"
                />
              </div>
            </section>
            <section>
              <h2>{t('Appearances')}</h2>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <CheckBox
                  name="darkMode"
                  className={`${styles.checkbox} darkMode`}
                  checked={settings.darkMode}
                  onChange={this.handleCheckboxChange}
                />
                <div>
                  <span className={styles.labelName}>{t('Dark Mode')}</span>
                  <p>{t('Switch to the dark mode.')}</p>
                </div>
              </label>
            </section>
            <section>
              <h2>{t('Security')}</h2>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <CheckBox
                  name="autoLog"
                  className={`${styles.checkbox} autoLog`}
                  checked={settings.autoLog}
                  onChange={this.toggleAutoLog}
                />
                <div>
                  <span className={styles.labelName}>{t('Auto Logout')}</span>
                  <p>{t('Log out automatically after 10 minutes.')}</p>
                </div>
              </label>
              {!account.afterLogout && account.token === tokenMap.LSK.key
                ? (
                  <SecondPassphraseSetting
                    account={account}
                    t={t}
                    isHardwareWalletAccount={isHardwareWalletAccount}
                    hasPendingSecondPassphrase={hasPendingSecondPassphrase}
                  />
                )
                : null}

              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <CheckBox
                  name="discreetMode"
                  className={`${styles.checkbox} discreetMode`}
                  checked={settings.discreetMode}
                  onChange={this.handleCheckboxChange}
                />
                <div>
                  <span className={styles.labelName}>{t('Discreet Mode')}</span>
                  <p>{t('Hide balance and transactions amounts')}</p>
                </div>
              </label>
            </section>
            <section>
              <h2>{t('Advanced')}</h2>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <CheckBox
                  name="showNetwork"
                  className={`${styles.checkbox} showNetwork`}
                  checked={settings.showNetwork}
                  onChange={this.handleCheckboxChange}
                />
                <div>
                  <span className={styles.labelName}>{t('Network switcher')}</span>
                  <p>{t('Enable a network switcher that lets you select testnet or custom node when logging in.')}</p>
                </div>
              </label>
              {
                !isHardwareWalletAccount && !isEmpty(account)
                  ? (
                    <label className={`${styles.fieldGroup} ${styles.checkboxField} enableBTC`}>
                      <CheckBox
                        name="BTC"
                        className={`${styles.checkbox}`}
                        checked={!!(settings.token && settings.token.list.BTC)}
                        onChange={this.handleTokenToggle}
                      />
                      <div>
                        <span className={styles.labelName}>{t('Enable BTC')}</span>
                        <p>{t('By enabling it, you will be able to manage your BTC inside the application.')}</p>
                      </div>
                    </label>
                  )
                  : null
              }
            </section>
            <section>
              <h2>{t('Privacy')}</h2>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <CheckBox
                  name="statistics"
                  className={`${styles.checkbox} statistics`}
                  checked={settings.statistics}
                  onChange={this.handleCheckboxChange}
                />
                <div>
                  <span className={styles.labelName}>
                    {t('Anonymous analytics collection')}
                  </span>
                  <p>{t('Help improve Lisk by allowing Lisk to gather anonymous usage data used for analytical purposes.')}</p>
                  <a target="_blank" href={links.privacyPolicy} className={styles.link}>
                    {t('Privacy Policy')}
                  </a>
                </div>
              </label>
            </section>
          </BoxContent>
        </Box>
      </Dialog>
    );
  }
}

export default Settings;
