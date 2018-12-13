import React from 'react';
import { FontIcon } from '../fontIcon';
import styles from './multiStep.css';

const MultiStepNav = ({
  steps, showNav, current, prevStep,
  browsable, backButtonLabel, prevPage,
}) => {
  // Checks if all titles are defined and showNav is not false
  const validateTitles = () => {
    const titlesAreValid = steps.reduce(
      (acc, step) =>
        (acc && typeof step.props.title === 'string' && step.props.title.length > 0)
      , true,
    );
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

  const backButtonFn = () => {
    if (current === 0) {
      prevPage();
    } else {
      prevStep();
    }
  };

  return (validateTitles() ?
    <nav className={styles.navigation}>
      {
        typeof backButtonLabel === 'string' ?
          <a onClick={backButtonFn} className={`${styles.backButton} multistep-back`}>
            <FontIcon className={styles.icon}>arrow-left</FontIcon>
            <span className={styles.label}>{backButtonLabel}</span>
          </a> : null
      }
      <section>
        {
          dashedSteps().map((step, index) =>
            <div key={step.props.title}
              onClick={() => { if (browsable) { prevStep({ to: (index / 2) }); } } }
              className={`${current === (index / 2) ? styles.current : ''} ${styles.navEl} ${step.dash ? styles.dash : 'title'}`}>
              {
                step.props.icon ?
                  <FontIcon className={styles.icon} value={step.props.icon} /> : null
              }
              <b className={styles.label}><small>{ step.props.title }</small></b>
            </div>)
        }
      </section>
      <span className={styles.backButtonShadow}></span>
    </nav> : <div className={styles.hidden}></div>);
};

export default MultiStepNav;
