import React from 'react';
import { FontIcon } from 'react-toolbox/lib/font_icon';
import styles from './multiStep.css';

const MultiStepNav = ({ steps, showNav, current }) => {
  // Checks if all titles are defined and showNav is not false
  const validateTitles = () => {
    const titlesAreValid = steps.reduce((acc, step) =>
      (acc && typeof step.props.title === 'string' && step.props.title.length > 0)
      , true);
    return showNav !== false && titlesAreValid;
  };

  const dashedSteps = () => {
    const elements = [];

    steps.forEach((step, index) => {
      elements.push(step);
      if (index !== steps.length - 1) {
        elements.push({ props: { title: `dash${index}` }, dash: 'dash' });
      }
    });

    return elements;
  };

  return (validateTitles() ?
    <nav className={styles.navigation}>
      {
        dashedSteps().map((step, index) =>
          <li key={step.props.title} className={`${current === index ? styles.current : ''} ${step.dash ? styles.dash : 'title'}`}>
            {
              step.props.icon ?
                <FontIcon className={styles.icon}> {step.props.icon}</FontIcon> : null
            }
            <b>{ step.props.title }</b>
          </li>)
      }
    </nav> : <div className={styles.hidden}></div>);
};

export default MultiStepNav;
