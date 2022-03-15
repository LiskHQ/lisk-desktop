import PropTypes from 'prop-types';
import React from 'react';
import styles from './pageLayout.css';

const PageLayout = ({
  width, verticalAlign, children, className,
}) => (
  <div className={[
    styles.wrapper,
    className,
    styles[verticalAlign],
  ].join(' ')}
  >
    <div className={styles[width]}>
      {children}
    </div>
  </div>
);

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOf(['full', 'medium']),
  verticalAlign: PropTypes.oneOf(['top', 'middle']),
};

PageLayout.defaultProps = {
  className: '',
  width: 'full',
  verticalAlign: 'top',
};

export default PageLayout;
