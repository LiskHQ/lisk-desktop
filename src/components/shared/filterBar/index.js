import React from 'react';
import moment from 'moment/min/moment-with-locales';
import { SecondaryButton } from '../../toolbox/buttons/button';
import { tokenMap } from '../../../constants/tokens';
import i18n from '../../../i18n';
import styles from './filterBar.css';

const FilterBar = ({
  t, clearFilter, clearAllFilters, filters, results, formatters,
}) => {
  moment.locale(i18n.language);

  const getNonEmptyFilters = fs => Object.values(fs).filter(Boolean);

  formatters = {
    dateFrom: value => `${t('from')} ${moment(value, t('DD.MM.YY')).format(t('DD MMM YYYY'))}`,
    dateTo: value => `${t('to')} ${moment(value, t('DD.MM.YY')).format(t('DD MMM YYYY'))}`,
    amountFrom: value => `> ${value} ${tokenMap.LSK.key}`,
    amountTo: value => `< ${value} ${tokenMap.LSK.key}`,
    ...formatters,
  };

  return !!getNonEmptyFilters(filters).length && (
    <div className={`${styles.container} filterBar`}>
      <span className={styles.label}>
        {t('Filtered results: {{results}}', { results })}
      </span>
      <div className={`${styles.labelsHolder}`}>
        {Object.keys(filters).map((filter, index) => {
          let label = filters[filter];
          if (label === '') return null;
          label = (formatters[filter] || (x => x))(label);
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

FilterBar.defaultProps = {
  formatters: {},
};

export default FilterBar;
