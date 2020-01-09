import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Tooltip from '../tooltip/tooltip';
import styles from '../table/table.css';
import { isReactComponent } from '../../../utils/helpers';

const Tip = ({ data }) => (
  data ? (
    <Tooltip
      title={data.title}
    >
      <p>{data.message}</p>
    </Tooltip>
  ) : null
);

const Sort = ({ fn, currentSort, children }) => {
  if (typeof fn === 'function') {
    const [title, direction] = currentSort ? currentSort.split(':') : [null, 'inactive'];
    const directions = {
      desc: styles.sortDesc,
      asc: styles.sortAsc,
      inactive: styles.sortInactive,
    };

    return (
      <span
        onClick={fn}
        className={`${styles.titleWrapper} sort-by ${title} ${directions[direction]}`}
      >
        {children}
      </span>
    );
  }
  return <span className={styles.titleWrapper}>{children}</span>;
};

const Header = ({ data, currentSort }) => {
  if (Array.isArray(data)) {
    return (
      <header className={`${grid.row} ${styles.row} ${styles.header}`}>
        {
          data.map((item, index) => (
            // @todo should define the default grid size
            // based on the number of children
            <div
              className={item.classList ? item.classList : grid['col-md-2']}
              key={`table-header-${index}`}
            >
              {
                (typeof item === 'object')
                  ? (
                    <Sort fn={item.sort} currentSort={currentSort}>
                      <span>{item.title}</span>
                      <Tip data={item.tooltip} />
                    </Sort>
                  ) : (
                    <span>{item}</span>
                  )
              }
            </div>
          ))
        }
      </header>
    );
  }
  if (isReactComponent(data)) {
    const Element = data;
    return <Element />;
  }
  // @todo what should we put here?
  return (<header>Header</header>);
};

export default Header;
