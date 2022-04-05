import React from 'react';
import { toast } from 'react-toastify';
import Piwik from '@common/utilities/piwik';
import { externalLinks } from '@common/configuration';
import settingsConst from '@settings/configuration/settingConstants';
import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import Dialog from '@basics/dialog/dialog';
import CurrencySelector from '@settings/setters/selectors/currencySelector';
import Toggle from '@settings/setters/toggles/toggle';
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
  }

  toggleAutoLog({ target }) {
    Piwik.trackingEvent('Settings', 'button', 'Toggle autoLog');
    const { account, timerReset, settings } = this.props;
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
    const { t } = this.props;

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
                <CurrencySelector t={t} />
              </div>
            </section>
            <section>
              <h2>{t('Appearance')}</h2>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <Toggle t={t} isCheckbox setting="darkMode" />
                <div>
                  <span className={styles.labelName}>{t('Dark mode')}</span>
                  <p>{t('Enable dark mode.')}</p>
                </div>
              </label>
            </section>
            <section>
              <h2>{t('Security')}</h2>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <Toggle t={t} isCheckbox setting="autoLog" />
                <div>
                  <span className={styles.labelName}>{t('Auto sign out')}</span>
                  <p>{t('Sign out automatically after 10 minutes.')}</p>
                </div>
              </label>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <Toggle t={t} isCheckbox setting="discreetMode" />
                <div>
                  <span className={styles.labelName}>{t('Discreet mode')}</span>
                  <p>{t('Hide balance and transactions amounts.')}</p>
                </div>
              </label>
            </section>
            <section>
              <h2>{t('Advanced')}</h2>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <Toggle t={t} isCheckbox setting="showNetwork" />
                <div>
                  <span className={styles.labelName}>
                    {t('Network switcher')}
                  </span>
                  <p>
                    {t(
                      'Enable network switcher to connect to different networks or service nodes when signing in.',
                    )}
                  </p>
                </div>
              </label>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <Toggle t={t} isCheckbox setting="enableCustomDerivationPath" />
                <div>
                  <span className={styles.labelName}>
                    {t('Enable custom derivation path')}
                  </span>
                  <p>{t('Modify recovery phrase derivation path')}</p>
                </div>
              </label>
            </section>
            <section>
              <h2>{t('Privacy')}</h2>
              <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
                <Toggle t={t} isCheckbox setting="statistics" />
                <div>
                  <span className={styles.labelName}>
                    {t('Anonymous analytics collection')}
                  </span>
                  <p>
                    {t('Help improve Lisk by sending anonymous usage data.')}
                  </p>
                  <a
                    target="_blank"
                    href={externalLinks.privacyPolicy}
                    className={styles.link}
                  >
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
