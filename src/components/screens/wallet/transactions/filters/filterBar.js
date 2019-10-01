import React from 'react';
import moment from 'moment/min/moment-with-locales';
import { SecondaryButton } from '../../../../toolbox/buttons/button';
import styles from './filterBar.css';
import i18n from '../../../../../i18n';

const FilterBar = ({
  t, clearFilter, clearAllFilters, customFilters, results,
}) => {
  moment.locale(i18n.language);
  return (
    <div className={`${styles.container} filterBar`}>
      <span className={styles.label}>
        {t('Filtered results: {{results}}', { results })}
      </span>
      <div className={`${styles.labelsHolder}`}>
        {Object.keys(customFilters).map((filter, index) => {
          let label = customFilters[filter];
          if (label === '') return null;

          switch (filter) {
            case 'dateFrom':
            case 'dateTo': {
              const prefix = filter === 'dateFrom' ? t('from') : t('to');
              label = `${prefix} ${moment(label, t('DD.MM.YY')).format(t('DD MMM YYYY'))}`;
              break;
            }
            case 'amountFrom':
            case 'amountTo': {
              const prefix = filter === 'amountFrom' ? '>' : '<';
              label = `${prefix} ${label} ${t('LSK')}`;
              break;
            }
            default:
              break;
          }

          return (
            <div
              className={`${styles.filter} filter`}
              key={filter + index}
            >
              <p className={styles.label}>{label}</p>
              <span
                className={`${styles.clearBtn} clear-filter`}
                onClick={() => clearFilter(filter)}
              />
            </div>
          );
        })
        }
        <SecondaryButton
          className="clear-all-filters"
          size="xs"
          onClick={clearAllFilters}
        >
          {t('Clear All filters')}
        </SecondaryButton>
      </div>
    </div>
  );
};

export default FilterBar;
