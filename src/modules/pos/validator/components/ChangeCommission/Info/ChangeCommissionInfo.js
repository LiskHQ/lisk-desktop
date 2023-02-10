import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentCommissionPercentage } from '@pos/validator/hooks/useCurrentCommissionPercentage';
import { convertCommissionToPercentage } from '@pos/validator/utils';
import styles from './ChangeCommissionInfo.css';

export const ChangeCommissionInfo = ({ transactionJSON }) => {
  const { t } = useTranslation();
  const { currentCommission } = useCurrentCommissionPercentage();

  return (
    <>
      <section className={styles.commission}>
        <label>{t('Old Commission')} (%)</label>
        <label className={`${styles.label}`} data-testid="current-commission">
          {currentCommission}
        </label>
      </section>
      <section className={styles.commission}>
        <label>{t('New Commission')} (%)</label>
        <label className={`${styles.label}`} data-testid="new-commission">
          {convertCommissionToPercentage(transactionJSON.params.newCommission)}
        </label>
      </section>
    </>
  );
};
