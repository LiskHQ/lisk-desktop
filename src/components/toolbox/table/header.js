import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Tooltip from '../tooltip/tooltip';
import styles from './table.css';
import { isReactComponent } from '../../../utils/helpers';

const Tip = ({ data }) => (
  data ? (
    <Tooltip
      title={data.title}
      className={data.position}
    >
      <p>{data.message}</p>
    </Tooltip>
  ) : null
);

const Sort = ({
  data, currentSort, children,
}) => {
  if (data && typeof data.fn === 'function') {
    const [currentKey, direction] = currentSort ? currentSort.split(':') : [null, 'inactive'];
    const directions = {
      desc: styles.sortDesc,
      asc: styles.sortAsc,
      inactive: styles.sortInactive,
    };

    return (
      <span
        onClick={() => data.fn(data.key)}
        className={`${styles.titleWrapper} sort-by ${data.key} ${currentKey === data.key ? directions[direction] : directions.inactive}`}
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
                    <Sort
                      data={item.sort}
                      currentSort={currentSort}
                    >
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
