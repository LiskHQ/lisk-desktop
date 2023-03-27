import React from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { tokenMap } from '@token/fungible/consts/tokens';
import { SecondaryButton } from 'src/theme/buttons';
import i18n from 'src/utils/i18n/i18n';

import styles from './filterBar.css';

const FilterButton = ({ filter, clearFilter, formatters }) => {
  const label = (formatters[filter.key] || ((x) => x))(filter.value);
  return (
    <div className={`${styles.filter} filter`}>
      <p className={styles.label}>{label?.toString()}</p>
      <span
        data-testid={`${filter.key}-filter`}
        className={`${styles.clearBtn} clear-filter`}
        onClick={() => clearFilter(filter.key)}
      />
    </div>
  );
};

const FilterBar = ({ clearFilter, clearAllFilters, filters, results, formatters }) => {
  moment.locale(i18n.language);
  const { t } = useTranslation();
  const nonEmptyFilters = Object.keys(filters).reduce((acc, key) => {
    const value = filters[key];
    if (key !== 'tab' && value !== '' && value !== undefined) {
      acc.push({ key, value });
    }
    return acc;
  }, []);

  formatters = {
    dateFrom: (value) => `${t('from')} ${moment(value, t('DD.MM.YY')).format(t('DD MMM YYYY'))}`,
    dateTo: (value) => `${t('to')} ${moment(value, t('DD.MM.YY')).format(t('DD MMM YYYY'))}`,
    amountFrom: (value) => `> ${value} ${tokenMap.LSK.key}`,
    amountTo: (value) => `< ${value} ${tokenMap.LSK.key}`,
    ...formatters,
  };

  return nonEmptyFilters.length ? (
    <div className={`${styles.container} filterBar`}>
      <span className={styles.label}>{t('Filtered results: {{results}}', { results })}</span>
      <div className={`${styles.labelsHolder}`}>
        {nonEmptyFilters.map((filter) => (
          <FilterButton
            filter={filter}
            key={filter.key}
            clearFilter={clearFilter}
            formatters={formatters}
          />
        ))}
        <SecondaryButton className="clear-all-filters" size="xs" onClick={() => clearAllFilters()}>
          {t('Clear all filters')}
        </SecondaryButton>
      </div>
    </div>
  ) : null;
};

FilterBar.defaultProps = {
  formatters: {},
};

export default FilterBar;
