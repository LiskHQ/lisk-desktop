import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Checkbox from '../toolbox/sliderCheckbox';
import styles from './setting.css';
import accountConfig from '../../constants/account';
import settingsConst from './../../constants/settings';
// TODO: will be re-enabled when the functionality is updated
import routes from '../../constants/routes';
import { FontIcon } from '../fontIcon';
import links from './../../constants/externalLinks';
import Piwik from '../../utils/piwik';
import BoxV2 from '../boxV2';
import Select from '../toolbox/select';

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
    this.onUpdateSettings({ currency: currency.value });
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

    return window.location.hash.indexOf('v2') > -1 ? (
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
                  <span>{t('Currency')}</span>
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

              </section>
              <section>
                <h1>{t('Developers')}</h1>
              </section>
              <section>
                <h1>{t('Privacy')}</h1>
              </section>
            </div>
          </BoxV2>
        </section>
      </div>
    ) : (
      <section className={`${grid['col-sm-12']} ${grid['col-md-8']}`}>
        <h4>{t('Security')}</h4>
        <div className={styles.item}>
          <label className={`${allowAuthClass}`}>{t('Second passphrase (Fee: 5 LSK)')}</label>
          {!hasSecondPassphrase ?
            <Link
              className={`register-second-passphrase ${styles.secondPassphrase} ${allowAuthClass}`}
              to={`${routes.secondPassphrase.path}`}>
              {t('Register')}
              <FontIcon>arrow-right</FontIcon>
            </Link> :
            <span
              className={`second-passphrase-registered ${styles.secondPassphraseEnabled}`}>
              {t('Registered')}
              <FontIcon>checkmark</FontIcon>
            </span>
          }
        </div>
        <div className={styles.item}>
          <label>{t('Auto-logout')}</label>
          <Checkbox
            theme={styles}
            className={`${styles.smallSlider} autoLog`}
            onChange={() => this.toggleAutoLog(!settings.autoLog)}
            input={{
              value: true,
              checked: settings.autoLog,
            }}/>
        </div>
        <h4>{t('Advanced features')}</h4>
        <div className={`${styles.item} ${styles.network}`}>
          <label>{t('Switch networks (Main-/Testnet, Custom)')}</label>
          <Checkbox
            theme={styles}
            className={`${styles.smallSlider} showNetwork`}
            onChange={() => this.onUpdateSettings({ showNetwork: !settings.showNetwork })}
            input={{
              value: false,
              checked: settings.showNetwork,
            }}/>
        </div>
        <div className={`${styles.item} ${styles.description}`}>
          {t('You will be able to select the desired network when signing in')}
        </div>
        <div className={styles.item}>
          <label>{t('Delegate features')}</label>
          <Checkbox
            theme={styles}
            className={`${styles.smallSlider} advancedMode`}
            onChange={() => this.onUpdateSettings({ advancedMode: !settings.advancedMode })}
            input={{
              value: true,
              checked: settings.advancedMode,
            }}/>
        </div>
        <div>
          <div className={`${styles.item} ${styles.network}`}>
            <label>{t('Send anonymous usage statistics')}</label>
            <Checkbox
              theme={styles}
              className={`${styles.smallSlider} statistics`}
              onChange={() => this.onUpdateSettings({ statistics: !settings.statistics })}
              input={{
                value: false,
                checked: settings.statistics,
              }}/>
          </div>
          <div className={`${styles.item} ${styles.privatePolicy}`}>
            {t('For more information refer to our ')}
            <a href={links.privacyPolicy} target={'_blank'}>{t('Privacy Policy')}</a>
          </div>
        </div>
        <h4>{t('Local')}</h4>
        <div className={styles.item}>
          <label>{t('Currency')}</label>
          <ul className={styles.currencyList}>
            {this.state.currencies.map(currency => (
              <li
                key={`currency-${currency}`}
                className={`currency currency-${currency} ${currency === activeCurrency ? `${styles.active} active` : ''}`}
                onClick={() => this.onUpdateSettings({ currency })}>
                {currency}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
}

export default Setting;
