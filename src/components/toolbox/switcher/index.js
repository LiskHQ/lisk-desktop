import PropTypes from 'prop-types';
import React from 'react';
import styles from './switcher.css';

const Switcher = ({ options, onClick, active }) => (
  <div>
    <ul className={styles.wrapper}>
      {options.map(tab => (
        <li
          className={[
            tab.value === active && styles.active,
            tab.className,
          ].filter(Boolean).join(' ')}
          key={tab.value}
          data-value={tab.value}
          onClick={onClick}
        >
          {tab.name}
        </li>
      ))}
    </ul>
  </div>
);

Switcher.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
  })),
  onClick: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired,
};

export default Switcher;
