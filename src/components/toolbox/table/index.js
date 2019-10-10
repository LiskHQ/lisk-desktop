import PropTypes from 'prop-types';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TableRow from './tableRow';
import styles from './table.css';

const Table = ({
  data, columns, onSortChange, sort,
}) => {
  const onHeaderClick = ({ id, isSortable }) => {
    if (isSortable) {
      onSortChange(id);
    }
  };

  const getSortClass = ({ id, isSortable }) => (
    isSortable && (
      sort.includes(id) ? (
        styles[sort.includes('asc') ? 'sortAsc' : 'sortDesc']
      ) : styles.sortable
    )
  );

  return (
    <React.Fragment>
      {!!data.length && (
      <TableRow isHeader className={grid.row}>
        {columns.map(({
          className, header, id, isSortable,
        }) => (
          <div key={id} className={className} onClick={() => onHeaderClick({ id, isSortable })}>
            <span className={getSortClass({ id, isSortable })}>
              {header}
            </span>
          </div>
        ))}
      </TableRow>
      )}
      {data.map(row => (
        <TableRow key={row.id} className={`${grid.row}`}>
          {columns.map(({ className, id, getValue }) => (
            <span className={className} key={id}>
              {typeof getValue === 'function' ? getValue(row) : row[id]}
            </span>
          ))}
        </TableRow>
      ))}
    </React.Fragment>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onSortChange: PropTypes.func,
  sort: PropTypes.string,
};

Table.defaultProps = {
  onSortChange: () => null,
  sort: '',
};

export default Table;
