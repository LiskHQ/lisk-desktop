import PropTypes from 'prop-types';
import React from 'react';
import styles from './box.css';

const Content = ({ children, ...rest }) => (
  <div {...rest} className={styles.content}>{children}</div>
);

Content.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

Content.displayName = 'Box.Content';

export default Content;
