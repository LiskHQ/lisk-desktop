import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Title from './title';
import Description from './description';
import Options from './options';
import styles from './dialog.css';
import { removeSearchParamsFromUrl } from '../../../utils/searchParams';

const Dialog = ({
  children, hasClose, className, history,
}) => {
  const onCloseClick = () => removeSearchParamsFromUrl(history, ['modal']);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {hasClose && (
        <span
          onClick={onCloseClick}
          className={`${styles.closeBtn} dialog-close-button`}
        />
      )}
      {children}
    </div>
  );
};

Dialog.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  hasClose: PropTypes.bool,
};

Dialog.defaultProps = {
  hasClose: false,
};

Dialog.Title = Title;
Dialog.Description = Description;
Dialog.Options = Options;

export default withRouter(Dialog);
