import React from 'react';
import { SecondaryButtonV2 } from '../../toolbox/buttons/button';
import styles from './filterBar.css';

const FilterBar = props => (
  <div className={`${styles.container} filterBar`}>
    <span className={styles.label}>
      {props.t('Filtered results: {{results}}', { results: props.results })}
    </span>
    {Object.keys(props.customFilters).map((filter, index) =>
      (props.customFilters[filter] ?
        <div
          className={`${styles.filter}`}
          key={filter + index}>
            <p className={styles.label}>{props.customFilters[filter]}</p>
            <span
              className={styles.closeBtn}
              onClick={() => props.clearFilter(filter)} />
        </div> :
        null))}
    <div className={`${styles.clearAll}`}>
      <SecondaryButtonV2
        className={styles.clearAllButton}
        onClick={props.clearAllFilters}>{props.t('Clear All filters')}
        </SecondaryButtonV2>
    </div>
  </div>);

export default FilterBar;
