import PropTypes from 'prop-types';
import React from 'react';
import styles from './box.css';

const Row = ({ children, ...rest }) => (
  <div {...rest} className={styles.row}>{children}</div>
);

Row.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

Row.displayName = 'Box.Row';

export default Row;
