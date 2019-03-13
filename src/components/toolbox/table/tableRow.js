import React from 'react';
import PropTypes from 'prop-types';
import styles from './table.css';

const TableRow = ({
  children, className, isHeader, ...props
}) => (
  <div className={`${styles.row} ${isHeader ? styles.header : ''} ${className}`} {...props}>
    {React.Children.map(children, item => item)}
  </div>
);

TableRow.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
  isHeader: PropTypes.bool,
};

TableRow.defaultProps = {
  className: '',
  isHeader: false,
};

export default TableRow;
