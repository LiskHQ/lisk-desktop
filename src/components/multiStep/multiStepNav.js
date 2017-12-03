import React from 'react';
import styles from './multiStep.css';

const MultiStepNav = ({ steps, showNav }) => {
  // Checks if all titles are defined and showNav is not false
  const validateTitles = () => {
    const titlesAreValid = steps.reduce((acc, step) =>
      (acc && typeof step.props.title === 'string' && step.props.title.length > 0)
      , true);
    return showNav !== false && titlesAreValid;
  };

  return (validateTitles() ?
    <nav className={styles.navigation}>
      {
        steps.map(child => <li key={child.props.title}>
          { child.props.title }
        </li>)
      }
    </nav> : <div className={styles.hidden}></div>);
};

export default MultiStepNav;
