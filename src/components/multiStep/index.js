import React from 'react';
import styles from './multiStep.css';

/**
 *
 * Accepts any number of children with any context and accessibility
 * to store and utilities
 *
 * Each child except the last one, should accept a functional property
 * named cb, and call it with an object containing all the properties required
 * for the next step
 *
 * Every next child may expect all properties passed from previous step
 * in addition to the hard coded properties
 *
 * Last child may won't receive a cb function from MultiStep
 *
 * @param {Boolean} showNav - defines the visibility of navigation, defaults to true
 *
 *
 */
class MultiStep extends React.Component {
  constructor() {
    super();

    this.state = {
      step: {
        count: 1,
        cb: (data) => {
          this.next(data);
        },
        data: {},
        current: 0,
      },
    };
  }

  componentWillMount() {
    const newState = Object.assign({}, this.state);
    newState.step.count = this.props.children.length;
    this.setState(newState);
  }

  next(data) {
    const newState = Object.assign({}, this.state);
    newState.step.data = data;
    newState.step.current++;
    this.setState(newState);
  }

  // Checks if all titles are defined and showNav is not false
  validateTitles() {
    const titlesAreValid = this.props.children.reduce((acc, child) =>
      (acc && typeof child.props.title === 'string' && child.props.title.length > 0)
      , true);
    return this.props.showNav !== false && titlesAreValid;
  }

  render() {
    const { children, className } = this.props;
    const { step } = this.state;

    return (<section className={className}>
      {
        this.validateTitles() ?
          <nav className={styles.navigation}>
            {
              children.map(child => <li key={child.props.title}>
                { child.props.title }
              </li>)
            }
          </nav> : null
      }
      {
        React.cloneElement(children[step.current], { cb: step.cb, ...step.data })
      }
    </section>);
  }
}

export default MultiStep;
