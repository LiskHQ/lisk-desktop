import PropTypes from 'prop-types';
import React from 'react';
import styles from './box.css';

const Content = ({ children, className, ...rest }) => (
  <div {...rest} className={`${styles.content} ${className}`}>{children}</div>
);

Content.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

Content.defaultProps = {
  className: '',
};

Content.displayName = 'Box.Content';

export default Content;
