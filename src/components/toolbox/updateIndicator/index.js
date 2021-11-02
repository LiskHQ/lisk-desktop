import React from 'react';
import { withTranslation } from 'react-i18next';
import Icon from '@toolbox/icon';
import { PrimaryButton } from '@toolbox/buttons';
import styles from './updateIndicator.css';

const UpdateIndicator = ({
  transferred, total, onAction, completed, t, closeToast,
}) => (
  <div className={styles.container}>
    <Icon name={completed ? 'downloadUpdateFinish' : 'downloadUpdateProgress'} />
    {
      completed
        ? (
          <>
            <div className={styles.completedContent}>
              <span>{t('Download completed')}</span>
              <span>100%</span>
            </div>
            <PrimaryButton
              onClick={onAction}
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
                <span>50%</span>
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
