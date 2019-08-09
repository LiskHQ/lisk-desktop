import PropTypes from 'prop-types';
import React from 'react';
import Content from './content';
import EmptyState from '../emptyState';
import FooterButton from './footerButton';
import Header from './header';
import ProgressBar from '../toolbox/progressBar/progressBar';
import Row from './row';
import Tabs from '../toolbox/tabs';
import styles from './box.css';

const Box = ({
  main, width, className, children, isLoading,
}) => {
  const hasHeader = Array.isArray(children) && children.some(child => (
    child && (child.type === 'header' || child.type.displayName === 'Box.Header')
  ));
  return (
    <div className={`
      ${styles.wrapper}
      ${hasHeader ? styles.withHeader : ''}
      ${main ? styles.main : ''}
      ${styles[width]}
      ${className}`}
    >
      {isLoading
        ? (
          <div className={styles.loadingOverlay}>
            <ProgressBar type="linear" mode="indeterminate" theme={styles} className="loading" />
          </div>
        )
        : null}
      { children }
    </div>
  );
};

Box.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOf(['full', 'medium']),
  isLoading: PropTypes.bool,
};

Box.defaultPropTypes = {
  className: '',
  width: 'full',
  isLoading: false,
};

Box.Header = Header;
Box.Tabs = Tabs;
Box.Tabs.displayName = 'Box.Tabs';
Box.Content = Content;
Box.FooterButton = FooterButton;
Box.Row = Row;
Box.EmptyState = EmptyState;

export default Box;
