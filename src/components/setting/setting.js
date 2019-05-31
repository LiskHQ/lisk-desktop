import React from 'react';
import { Link } from 'react-router-dom';

import styles from './setting.css';
import accountConfig from '../../constants/account';
import settingsConst from './../../constants/settings';
import routes from '../../constants/routes';
import links from './../../constants/externalLinks';
import Piwik from '../../utils/piwik';
import BoxV2 from '../boxV2';
import Select from '../toolbox/select';
import CheckBox from '../toolbox/checkBox';
import SignInTooltipWrapper from '../signInTooltipWrapper';

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {
      currencies: settingsConst.currencies,
    };

    this.setCurrency = this.setCurrency.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.toggleAutoLog = this.toggleAutoLog.bind(this);
  }

  toggleAutoLog({ target }) {
    Piwik.trackingEvent('Settings', 'button', 'Toggle autoLog');
    const {
      account, accountUpdated,
    } = this.props;
    if (target && account.passphrase) {
      const date = Date.now() + accountConfig.lockDuration;
      accountUpdated({ expireTime: date });
    }
    this.handleCheckboxChange({ target });
  }

  setCurrency(currency) {
    const { settings } = this.props;
    if (settings.currency !== currency.value) this.onUpdateSettings({ currency: currency.value });
  }

  handleCheckboxChange({ target: { name } }) {
    const { settings } = this.props;
    this.onUpdateSettings({ [name]: !settings[name] });
  }

  onUpdateSettings(newSettings) {
    const { settingsUpdated, toastDisplayed, t } = this.props;
    Piwik.trackingEvent('Settings', 'button', 'Update settings');
    settingsUpdated(newSettings);
    toastDisplayed({ label: t('Settings saved!') });
  }

  render() {
    const {
      t, settings,
      hasSecondPassphrase,
    } = this.props;
    const { currencies } = this.state;

    const isHwWalletClass = (this.props.account.hwInfo && this.props.account.hwInfo.deviceId)
      ? `${styles.disabled} disabled`
      : '';
    const activeCurrency = currencies.indexOf(settings.currency || settingsConst.currencies[0]);

    return (
      <div className={styles.settingsHolder}>
        <BoxV2 className={styles.wrapper}>
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
                  className={'currency'}
                />
              </div>
            </section>
            <section>
              <h1>{t('Security')}</h1>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <CheckBox
                  name={'autoLog'}
                  className={`${styles.checkbox} autoLog`}
                  checked={settings.autoLog}
                  onChange={this.toggleAutoLog}
                  />
                  <div>
                  <span className={styles.labelName}>{t('Auto Logout')}</span>
                  <p>{t('Log out automatically after a specified amount of time.')}</p>
                  </div>
              </label>
              <div className={`${styles.fieldGroup} ${styles.checkboxField} second-passphrase`}>
                <CheckBox
                  className={`${styles.checkbox} ${!hasSecondPassphrase ? styles.hide : ''}`}
                  checked={hasSecondPassphrase}
                />
                <div className={isHwWalletClass}>
                  <span className={styles.labelName}>{t('Second Passphrase')}</span>
                  <p>
                    {t('Every time you make a transaction you’ll need to enter your second passphrase in order to confirm it.')}
                  </p>
                  <p className={styles.highlight}>{t('Once activated can’t be turned off.')}</p>
                  {!hasSecondPassphrase ?
                    <SignInTooltipWrapper>
                      <Link
                        className={`register-second-passphrase ${styles.link}`}
                        to={`${routes.secondPassphrase.path}`}>
                        {t('Activate (5 LSK Fee)')}
                      </Link>
                    </SignInTooltipWrapper>
                  : null}
                </div>
              </div>
            </section>
            <section>
              <h1>{t('Advanced')}</h1>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <CheckBox
                  name={'showNetwork'}
                  className={`${styles.checkbox} showNetwork`}
                  checked={settings.showNetwork}
                  onChange={this.handleCheckboxChange}
                />
                <div>
                  <span className={styles.labelName}>{t('Network switcher')}</span>
                  <p>{t('Enable a network switcher that lets you select testnet or custom node when logging in.')}</p>
                </div>
              </label>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <CheckBox
                  name={'advancedMode'}
                  className={`${styles.checkbox} advancedMode`}
                  checked={settings.advancedMode}
                  onChange={this.handleCheckboxChange}
                />
                <div>
                  <span className={styles.labelName}>{t('Delegate Features')}</span>
                </div>
              </label>
            </section>
            <section>
              <h1>{t('Privacy')}</h1>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <CheckBox
                  name={'statistics'}
                  className={`${styles.checkbox} statistics`}
                  checked={settings.statistics}
                  onChange={this.handleCheckboxChange}
                />
                <div>
                  <span className={styles.labelName}>
                    {t('Anonymous analytics collection')}
                  </span>
                  <p>{t('Help improve Lisk Hub by allowing Lisk to gather anonymous usage data used for analytical purposes.')}</p>
                  <a target="_blank" href={links.privacyPolicy} className={styles.link}>
                    {t('Privacy Policy')}
                  </a>
                </div>
              </label>
            </section>
          </div>
        </BoxV2>
      </div>
    );
  }
}

export default Setting;
