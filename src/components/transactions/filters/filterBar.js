import React from 'react';
import moment from 'moment';
import { SecondaryButtonV2 } from '../../toolbox/buttons/button';
import styles from './filterBar.css';

const FilterBar = props => (
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
            label = `${prefix} ${moment(label, 'DD.MM.YY').format('DD MMM YYYY')}`;
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
      <SecondaryButtonV2
        className="clear-all-filters extra-small"
        onClick={props.clearAllFilters}
      >
        {props.t('Clear All filters')}
      </SecondaryButtonV2>
    </div>
  </div>
);

export default FilterBar;
