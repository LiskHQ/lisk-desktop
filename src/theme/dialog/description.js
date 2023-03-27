import React from 'react';
import PropTypes from 'prop-types';
import styles from './dialog.css';

const Description = ({ children }) => <div className={styles.description}>{children}</div>;

Description.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

Description.displayName = 'Dialog.Description';

export default Description;
