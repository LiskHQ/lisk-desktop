import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Icon from '@toolbox/icon';
import { PrimaryButton } from '@toolbox/buttons';
import styles from './updateIndicator.css';

const Content = ({
  transferred, total, completed, t, closeToast,
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
              onClick={() => {}}
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

const UpdateIndicator = ({ t }) => {
  const { ipc } = window;
  const toastId = 'update-download';
  const onProgress = (transferred, total) => {
    toast.update(toastId, {
      render: () => <Content t={t} transferred={50} total={100} />,
    });
  };
  const onComplete = () => {
    toast.update(toastId, {
      render: () => <Content t={t} completed />,
    });
  };

  if (ipc) {
    ipc.on('downloadProgress', onProgress);
    ipc.on('updateDownloaded', onComplete);
  }

  useEffect(() => {
    toast(<Content t={t} />, {
      toastId,
      autoClose: false,
    });
  }, []);

  return (
    <>
      <PrimaryButton onClick={onProgress}>increase</PrimaryButton>
      <PrimaryButton onClick={onComplete}>complete</PrimaryButton>
    </>
  );
};

export default withTranslation()(UpdateIndicator);
