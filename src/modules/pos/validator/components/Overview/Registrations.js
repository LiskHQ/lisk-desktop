import React from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart } from '@common/components/charts';
import BoxEmptyState from '@theme/box/emptyState';
import { useRegistrations } from '../../hooks/queries';
import styles from './Overview.css';

const Registrations = () => {
  const { t } = useTranslation();
  const { data: { labels, values }, isLoading } = useRegistrations();

  if (isLoading || !values.length) {
    return (
      <BoxEmptyState>
        <p>{t('No validators information')}</p>
      </BoxEmptyState>
    );
  }

  return (
    <div className={styles.chartBox}>
      <h2 className={styles.title}>{t('Registered validators')}</h2>
      <div className={styles.chart}>
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: values,
                pointStyle: 'line',
              },
            ],
          }}
          options={{ legend: { display: false } }}
        />
      </div>
    </div>
  );
};

export default Registrations;
