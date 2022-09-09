import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { isReactComponent } from 'src/utils/helpers';
import Tooltip from 'src/theme/Tooltip';
import styles from './table.css';

const Tip = ({ data }) => {
  if (!data || typeof data !== 'object' || isReactComponent(data.message)) return null;
  const Message = typeof data.message === 'string' ? () => <p>{data.message}</p> : data.message;
  return (
    <Tooltip {...data}>
      <Message />
    </Tooltip>
  );
};

const Sort = ({ data, currentSort, children }) => {
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
        className={`${styles.titleWrapper} sort-by ${data.key} ${
          currentKey === data.key ? directions[direction] : directions.inactive
        }`}
      >
        {children}
      </span>
    );
  }
  return <span className={styles.titleWrapper}>{children}</span>;
};

const Header = ({ data, currentSort, headerClassName, subHeader }) => {
  /**
   * In case we define a config array for header
   */
  if (Array.isArray(data)) {
    const defaultSize = Math.floor(12 / data.length);
    return (
      <header className={`${grid.row} ${styles.row} ${styles.header} ${headerClassName || ''}`}>
        {data.map((item, index) => (
          <div
            className={item.classList ? item.classList : grid[`col-md-${defaultSize}`]}
            key={`table-header-${index}`}
          >
            {typeof item === 'object' ? (
              <Sort data={item.sort} currentSort={currentSort}>
                <span>{item.title}</span>
                {item.tooltip && <Tip data={item.tooltip} />}
              </Sort>
            ) : (
              <>
                <span>{item}</span>
                {item.tooltip && <Tip data={item.tooltip} />}
              </>
            )}
          </div>
        ))}
        {subHeader}
      </header>
    );
  }

  /**
   * In case we define a custom header component
   */
  if (isReactComponent(data)) {
    const Element = data;
    return <Element />;
  }

  /**
   * If the data is not passed or it's none of the above
   */
  return <header className={styles.header}>Header</header>;
};

export default Header;
