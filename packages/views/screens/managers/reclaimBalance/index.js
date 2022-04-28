import React from 'react';
import { withTranslation } from 'react-i18next';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import Introduction from './introduction';
import Reclaim from './reclaim';
import styles from './index.css';

const ReclaimBalance = ({ t }) => (
  <MultiStep className={styles.multiStep}>
    <Introduction t={t} />
    <Reclaim t={t} />
  </MultiStep>
);

export default withTranslation()(ReclaimBalance);
