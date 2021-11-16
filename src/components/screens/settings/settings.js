import React from 'react';
import { toast } from 'react-toastify';
import Piwik from '@utils/piwik';
import { externalLinks, settings as settingsConst } from '@constants';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import CheckBox from '@toolbox/checkBox';
import Select from '@toolbox/select';
import Dialog from '@toolbox/dialog/dialog';
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
      account, timerReset, settings,
    } = this.props;
    if (!settings.autolog && account.passphrase) {
      timerReset();
    }
    this.handleCheckboxChange({ target });
  }

  setCurrency(currency) {
    const { settings } = this.props;
    if (settings.currency !== currency) this.onUpdateSettings({ currency });
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
      account,
    } = this.props;
    const { currencies } = this.state;

    const isHardwareWalletAccount = account.hwInfo && !!account.hwInfo.deviceId;
    const activeCurrency = settings.currency || settingsConst.currencies[0];

    return (
      <Dialog hasClose className={styles.dialogWrapper}>
        <Box className={styles.wrapper}>
          <BoxHeader>
            <h1>{t('Settings')}</h1>
          </BoxHeader>
          <BoxContent className={styles.content}>
            <section>
              <h2>{t('Currency')}</h2>
              <div className={styles.fieldGroup}>
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
              <h2>{t('Appearance')}</h2>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <CheckBox
                  name="darkMode"
                  className={`${styles.checkbox} darkMode`}
                  checked={settings.darkMode}
                  onChange={this.handleCheckboxChange}
                />
                <div>
                  <span className={styles.labelName}>{t('Dark mode')}</span>
                  <p>{t('Enable dark mode.')}</p>
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
                  <span className={styles.labelName}>{t('Auto sign out')}</span>
                  <p>{t('Sign out automatically after 10 minutes.')}</p>
                </div>
              </label>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <CheckBox
                  name="discreetMode"
                  className={`${styles.checkbox} discreetMode`}
                  checked={settings.discreetMode}
                  onChange={this.handleCheckboxChange}
                />
                <div>
                  <span className={styles.labelName}>{t('Discreet mode')}</span>
                  <p>{t('Hide balance and transactions amounts.')}</p>
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
                  <p>{t('Enable network switcher to connect to different networks or service nodes when signing in.')}</p>
                </div>
              </label>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <CheckBox
                  name="enableCustomDerivationPath"
                  className={`${styles.checkbox} enableCustomDerivationPath`}
                  checked={settings.enableCustomDerivationPath}
                  onChange={this.handleCheckboxChange}
                />
                <div>
                  <span className={styles.labelName}>{t('Enable custom derivation path')}</span>
                  <p>{t('Modify recovery phrase derivation path')}</p>
                </div>
              </label>
              {
                !isHardwareWalletAccount
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
                        <p>{t('Enable Bitcoin wallet support.')}</p>
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
                  <p>{t('Help improve Lisk by sending anonymous usage data.')}</p>
                  <a target="_blank" href={externalLinks.privacyPolicy} className={styles.link}>
                    {t('Privacy policy')}
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
