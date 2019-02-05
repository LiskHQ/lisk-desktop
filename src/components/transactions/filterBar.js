import React from 'react';
import { FontIcon } from '../fontIcon';

import styles from './filterBar.css';

const FilterBar = props => (
  <div className={`${styles.container}`}>
    <div className={styles.label}>{props.t('Filtered results')}:</div>
    {Object.keys(props.customFilters).map((filter, index) =>
      (props.customFilters[filter] ?
        <div
          className={`${styles.filter}`}
          key={filter + index}>
            <p>{props.customFilters[filter]}</p>
            <div onClick={() => {
              props.clearFilter(filter);
            }}>
              <FontIcon className={styles.icon} value='close' />
            </div>
        </div> :
        null))}
    <div className={`${styles.filter} ${styles.clearAll}`}>
      <div>
        <p onClick={() => { props.clearAllFilters(); }}>{props.t('Clear All filters')}</p>
      </div>
    </div>
  </div>);

export default FilterBar;
