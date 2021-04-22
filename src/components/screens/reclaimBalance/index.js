import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import MultiStep from '@shared/multiStep';
import Introduction from './introduction';
import Reclaim from './reclaim';
import styles from './index.css';

const disableKeyboardNavigation = (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.keyCode === 37 || e.keyCode === 39) {
      e.preventDefault();
    }
  }
};

const ReclaimBalance = ({ t }) => {
  useEffect(() => {
    document.addEventListener('keydown', disableKeyboardNavigation);
    return () => {
      document.removeEventListener('keydown', disableKeyboardNavigation);
    };
  }, []);

  return (
    <MultiStep className={styles.multiStep}>
      <Introduction t={t} />
      <Reclaim t={t} />
    </MultiStep>
  );
};

export default withTranslation()(ReclaimBalance);
