import React from 'react';
import PropTypes from 'prop-types';
import styles from './table.css';

const TableRow = ({
  children, className, isHeader, Container, ...props
}) => (
  <Container className={`${styles.row} ${isHeader ? styles.header : ''} ${className}`} {...props}>
    {React.Children.map(children, item => item)}
  </Container>
);
const DefaultContainer = ({ children, ...props }) => <div {...props}>{children}</div>;

TableRow.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
  isHeader: PropTypes.bool,
  Container: PropTypes.elementType,
};

TableRow.defaultProps = {
  className: '',
  isHeader: false,
  Container: DefaultContainer,
};

export default TableRow;
