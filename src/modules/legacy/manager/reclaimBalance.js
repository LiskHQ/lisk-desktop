import React from 'react';
import { withTranslation } from 'react-i18next';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import Introduction from '../components/Introduction';
import AccountsComparison from '../components/AccountsComparison';
import styles from '../components/Introduction/introduction.css';

const ReclaimBalance = ({ t }) => (
  <MultiStep className={styles.multiStep}>
    <Introduction t={t} />
    <AccountsComparison t={t} />
  </MultiStep>
);

export default withTranslation()(ReclaimBalance);
