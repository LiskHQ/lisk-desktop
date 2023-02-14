import React from 'react';
import { withTranslation } from 'react-i18next';
import Icon from 'src/theme/Icon';
import styles from './WarnPunishedValidator.css';

const StakeWarning = ({ t, daysLeft }) => (
  <div className={styles.stakeWarning}>
    <Icon name="warningYellow" />
    <span className={styles.rightSpace} />
    {t(
      'Caution! You are about to stake for the punished validator, this will result in your LSK tokens being locked for a period of {{daysLeft}} days. In addition, please note that your stake will not be counted until the {{daysLeft}} day period has expired. ',
      {
        daysLeft,
      }
    )}
  </div>
);

export default withTranslation()(StakeWarning);
