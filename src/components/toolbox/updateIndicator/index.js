import React from 'react';
import { withTranslation } from 'react-i18next';
import Icon from '@toolbox/icon';
import { PrimaryButton } from '@toolbox/buttons';
import styles from './updateIndicator.css';

const UpdateIndicator = ({
  transferred = 0, total = 1, quitAndInstall, completed, t, closeToast,
}) => (
  <div className={styles.container}>
    <Icon name={completed ? 'downloadUpdateFinish' : 'downloadUpdateProgress'} />
    {
      completed
        ? (
          <>
            <div className={styles.completedContent}>
              <span>{t('Download completed')}</span>
              <span className={styles.percentage}>100%</span>
            </div>
            <PrimaryButton
              onClick={quitAndInstall}
            >
              {t('Restart app')}
            </PrimaryButton>
          </>
        )
        : (
          <>
            <div className={styles.progressContent}>
              <p>
                <span>{t('Loading in progress')}</span>
                <span className={styles.percentage}>{`${parseFloat((transferred / total) * 100).toFixed(2)}%`}</span>
              </p>
              <div className={styles.progressBar}>
                <div className={styles.lineForged} style={{ width: `${(transferred / total) * 100}%` }} />
              </div>
            </div>
            <span className={styles.closeBtn} onClick={closeToast} />
          </>
        )
    }
  </div>
);

export default withTranslation()(UpdateIndicator);
