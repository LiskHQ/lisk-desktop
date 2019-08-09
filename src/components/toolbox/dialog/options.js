import React from 'react';
import PropTypes from 'prop-types';
import DialogHolder from './holder';
import styles from './dialog.css';

const Options = ({ children, align }) => {
  const options = (Array.isArray(children)
    ? children
    : [children]
  ).filter(child => React.isValidElement(child));

  return !!options.length && (
    <div className={`${styles.optionsHolder} ${styles[align]}`}>
      {
      options.map((option, index) => {
        const { onClick, ...props } = option.props;
        const optionClick = onClick
          ? (...args) => { onClick(...args); DialogHolder.hideDialog(); }
          : DialogHolder.hideDialog;
        return (
          <option.type
            {...props}
            key={`option-${index}`}
            onClick={optionClick}
          />
        );
      })
    }
    </div>
  );
};

Options.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  align: PropTypes.oneOf(['left', 'center', 'right']),
};

Options.defaultProps = {
  align: 'right',
};

Options.displayName = 'Dialog.Options';

export default Options;
