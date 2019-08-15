import React from 'react';
import moment from 'moment/min/moment-with-locales';
import { SecondaryButton } from '../../toolbox/buttons/button';
import styles from './filterBar.css';
import i18n from '../../../i18n';

const FilterBar = (props) => {
  moment.locale(i18n.language);
  return (
    <div className={`${styles.container} filterBar`}>
      <span className={styles.label}>
        {props.t('Filtered results: {{results}}', { results: props.results })}
      </span>
      <div className={`${styles.labelsHolder}`}>
        {Object.keys(props.customFilters).map((filter, index) => {
          let label = props.customFilters[filter];
          if (label === '') return null;

          switch (filter) {
            case 'dateFrom':
            case 'dateTo': {
              const prefix = filter === 'dateFrom' ? props.t('from') : props.t('to');
              label = `${prefix} ${moment(label, props.t('DD.MM.YY')).format(props.t('DD MMM YYYY'))}`;
              break;
            }
            case 'amountFrom':
            case 'amountTo': {
              const prefix = filter === 'amountFrom' ? '>' : '<';
              label = `${prefix} ${label} ${props.t('LSK')}`;
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
                onClick={() => props.clearFilter(filter)}
              />
            </div>
          );
        })
        }
        <SecondaryButton
          className="clear-all-filters extra-small"
          onClick={props.clearAllFilters}
        >
          {props.t('Clear All filters')}
        </SecondaryButton>
      </div>
    </div>
  );
};

export default FilterBar;
