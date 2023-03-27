import React from 'react';
import PropTypes from 'prop-types';
import styles from './dialog.css';

const Title = ({ children }) => children && <h1 className={styles.title}>{children}</h1>;

Title.propTypes = {
  children: PropTypes.string.isRequired,
};

Title.displayName = 'Dialog.Title';

export default Title;
