import React from 'react';
import { Link } from 'react-router-dom';

import styles from './setting.css';
import accountConfig from '../../constants/account';
import settingsConst from './../../constants/settings';
// TODO: will be re-enabled when the functionality is updated
import routes from '../../constants/routes';
import links from './../../constants/externalLinks';
import Piwik from '../../utils/piwik';
import BoxV2 from '../boxV2';
import Select from '../toolbox/select';
import CheckBox from '../toolbox/checkBox';

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {
      currencies: settingsConst.currencies,
    };

    this.setCurrency = this.setCurrency.bind(this);
  }

  toggleAutoLog(state) {
    Piwik.trackingEvent('Settings', 'button', 'Toggle autoLog');
    const {
      account, settings, settingsUpdated, accountUpdated,
    } = this.props;
    if (state && account.passphrase) {
      const date = Date.now() + accountConfig.lockDuration;
      accountUpdated({ expireTime: date });
    }
    settingsUpdated({ autoLog: !settings.autoLog });
  }

  setCurrency(currency) {
    const { settings } = this.props;
    if (settings.currency !== currency.value) this.onUpdateSettings({ currency: currency.value });
  }

  onUpdateSettings(newSettings) {
    Piwik.trackingEvent('Settings', 'button', 'Update settings');
    this.props.settingsUpdated(newSettings);
  }

  render() {
    const {
      t, settings,
      hasSecondPassphrase,
    } = this.props;
    const { currencies } = this.state;

    const allowAuthClass = !this.props.isAuthenticated ||
      (this.props.account.hwInfo && this.props.account.hwInfo.deviceId) ?
      `${styles.disable} disabled` : '';
    const activeCurrency = currencies.indexOf(settings.currency || settingsConst.currencies[0]);

    return (
      <div className={styles.settingsHolder}>
        <section className={styles.wrapper}>
          <BoxV2>
            <header>
              <h1>{t('Settings')}</h1>
            </header>
            <div className={styles.content}>
              <section>
                <h1>{t('Locale')}</h1>
                <div className={styles.fieldGroup}>
                  <span className={styles.labelName}>{t('Currency')}</span>
                  <Select
                    options={currencies.map(currency => ({
                      label: currency, value: currency,
                    }))}
                    selected={activeCurrency}
                    onChange={this.setCurrency}
                  />
                </div>
              </section>
              <section>
                <h1>{t('Security')}</h1>
                <div className={styles.fieldGroup}>
                  <CheckBox
                    className={'autoLog'}
                    checked={settings.autoLog}
                    onChange={this.onUpdateSettings.bind(this, { autoLog: !settings.autoLog })}
                   />
                   <span className={styles.labelName}>{t('Auto Logout')}</span>
                   <p>{t('Log out automatically after a specified amount of time.')}</p>
                </div>
                <div className={styles.fieldGroup}>
                  <CheckBox
                    checked={hasSecondPassphrase} />
                  <span className={styles.labelName}>{t('Second Passphrase')}</span>
                  <p>
                    {t('Every time you make a transaction you’ll need to enter your second passphrase in order to confirm it.')}
                  </p>
                  <p className={styles.highlight}>{t('Once activated can’t be turned off.')}</p>
                  <Link
                    className={`register-second-passphrase ${styles.link} ${allowAuthClass}`}
                    to={`${routes.secondPassphrase.path}`}>
                    {t('Activate (5 LSK Fee)')}
                  </Link>
                </div>
              </section>
              <section>
                <h1>{t('Developers')}</h1>
                <div className={styles.fieldGroup}>
                  <CheckBox
                    className={'showNetwork'}
                    checked={settings.showNetwork}
                    onChange={this.onUpdateSettings.bind(this, {
                      showNetwork: !settings.showNetwork,
                    })}
                  />
                  <span className={styles.labelName}>{t('Network switcher')}</span>
                  <p>{t('Enable a network switcher that lets you select testnet or custom node when logging in.')}</p>
                </div>
              </section>
              <section>
                <h1>{t('Privacy')}</h1>
                <div className={styles.fieldGroup}>
                  <CheckBox
                    className={'statistics'}
                    checked={settings.statistics}
                    onChange={this.onUpdateSettings.bind(this, {
                      statistics: !settings.statistics,
                    })}
                  />
                  <span className={styles.labelName}>
                    {t('Anonymous analytics collection')}
                  </span>
                  <p>{t('Help improve Lisk Hub by allowing Lisk to gather anonymous usage data used for analytical purposes.')}</p>
                  <a target="_blank" href={links.privacyPolicy} className={styles.link}>
                    {t('Privacy Policy')}
                  </a>
                </div>
              </section>
            </div>
          </BoxV2>
        </section>
      </div>
    );
  }
}

export default Setting;
