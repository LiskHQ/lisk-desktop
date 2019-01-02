import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

// import ReactSwipe from 'react-swipe';
import Checkbox from '../toolbox/sliderCheckbox';
import styles from './setting.css';
import accountConfig from '../../constants/account';
import settingsConst from './../../constants/settings';
// TODO: will be re-enabled when the functionality is updated
import routes from '../../constants/routes';
import { FontIcon } from '../fontIcon';
import Box from '../box';
import Piwik from '../../utils/piwik';
// import languageSwitcherTheme from './languageSwitcher.css';

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {
      currencies: settingsConst.currencies,
    };
  }

  toggleAutoLog(state) {
    Piwik.trackingEvent('Settings', 'button', 'onToggleAutoLog');
    const {
      account, settings, settingsUpdated, accountUpdated,
    } = this.props;
    if (state && account.passphrase) {
      const date = Date.now() + accountConfig.lockDuration;
      accountUpdated({ expireTime: date });
    }
    settingsUpdated({ autoLog: !settings.autoLog });
  }

  onUpdateSettings(newSettings) {
    Piwik.trackingEvent('Settings', 'button', 'onUpdateSettings');
    this.props.settingsUpdated(newSettings);
  }

  render() {
    const {
      t, settings,
      hasSecondPassphrase,
    } = this.props;

    /* istanbul ignore next */
    const allowAuthClass = !this.props.isAuthenticated ? `${styles.disable} disabled` : '';
    const activeCurrency = settings.currency || settingsConst.currencies[0];

    return (<Box className={styles.wrapper}>
      <aside className={`${grid['col-sm-12']} ${grid['col-md-4']}`}>
        <header>
          <h4>{t('Settings')}</h4>
          <p>{t('Set up Lisk Hub and your account.')}</p>
        </header>
      </aside>
      <section className={`${grid['col-sm-12']} ${grid['col-md-8']}`}>
        <h4 className={`${allowAuthClass}`}>{t('Security')}</h4>
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
            onChange={() =>
              this.onUpdateSettings({ showNetwork: !settings.showNetwork }).bind(this)
            }
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
            onChange={() =>
              this.onUpdateSettings({ advancedMode: !settings.advancedMode }).bind(this)
            }
            input={{
              value: true,
              checked: settings.advancedMode,
            }}/>
        </div>
        <h4>{t('Local')}</h4>
        <div className={styles.item}>
          <label>{t('Currency')}</label>
          <ul className={styles.currencyList}>
            {this.state.currencies.map(currency => (
              <li
                key={`currency-${currency}`}
                className={`currency currency-${currency} ${currency === activeCurrency ? `${styles.active} active` : ''}`}
                onClick={() => this.onUpdateSettings({ currency }).bind(this)}>
                {currency}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Box>);
  }
}

export default Setting;
