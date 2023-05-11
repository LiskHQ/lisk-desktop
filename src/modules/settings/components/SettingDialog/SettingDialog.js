import React from 'react';
import { useTranslation } from 'react-i18next';
import { externalLinks } from 'src/utils/externalLinks';
import settingsConst from 'src/modules/settings/const/settingConstants';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import Dialog from 'src/theme/dialog/dialog';
import CurrencySelector from 'src/modules/settings/components/currencySelector';
import Toggle from 'src/modules/settings/components/toggle';
import styles from './settingDialog.css';

function SettingDialog() {
  const { t } = useTranslation();

  return (
    <Dialog hasClose className={styles.dialogWrapper}>
      <Box className={styles.wrapper}>
        <BoxHeader>
          <h1>{t('Settings')}</h1>
        </BoxHeader>
        <BoxContent className={styles.content}>
          <section className="currency">
            <h2>{t('Currency')}</h2>
            <div className={styles.fieldGroup}>
              <CurrencySelector />
            </div>
          </section>
          <section className="appearance">
            <h2>{t('Appearance')}</h2>
            <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
              <Toggle isCheckbox setting={settingsConst.keys.darkMode} />
              <div>
                <span className={styles.labelName}>{t('Dark mode')}</span>
                <p>{t('Enable dark mode.')}</p>
              </div>
            </label>
          </section>
          <section className="security">
            <h2>{t('Security')}</h2>
            <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
              <Toggle isCheckbox setting={settingsConst.keys.discreetMode} />
              <div>
                <span className={styles.labelName}>{t('Discreet mode')}</span>
                <p>{t('Hide balance and transactions amounts.')}</p>
              </div>
            </label>
          </section>
          <section className="advanced">
            <h2>{t('Advanced')}</h2>
            <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
              <Toggle isCheckbox setting={settingsConst.keys.enableAccessToLegacyAccounts} />
              <div>
                <span className={styles.labelName}>
                  {t('Enable access to legacy Lisk accounts')}
                </span>
                <p>{t('Access to Lisk protocol v3 or older accounts.')}</p>
              </div>
            </label>
          </section>
          <section className="privacy">
            <h2>{t('Privacy')}</h2>
            <label className={`${styles.fieldGroup} ${styles.checkboxField}`}>
              <Toggle isCheckbox setting={settingsConst.keys.statistics} />
              <div>
                <span className={styles.labelName}>{t('Anonymous analytics collection')}</span>
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

export default SettingDialog;
