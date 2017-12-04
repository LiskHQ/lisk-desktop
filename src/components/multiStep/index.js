import React from 'react';
import MultiStepNav from './multiStepNav';

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
        nextStep: (data) => {
          this.next(data);
        },
        prevStep: (data) => {
          this.prev(data);
        },
        data: [{}],
        current: 0,
      },
    };
  }

  next(data) {
    const newState = Object.assign({}, this.state);
    newState.step.current++;
    newState.step.data[newState.step.current] = data;
    this.setState(newState);
  }

  prev(config) {
    let dec = 1;
    if (!!config && typeof config.jump === 'number' && config.jump <= this.state.step.current) {
      dec = Math.abs(Math.floor(config.jump));
    } else if (!!config && config.reset === true) {
      dec = this.state.step.current;
    }

    const newState = Object.assign({}, this.state);
    newState.step.current -= dec;

    this.setState(newState);
  }

  render() {
    const { children, className } = this.props;
    const { step } = this.state;

    return (<section className={className}>
      <MultiStepNav steps={children} showNav={this.props.showNav} current={step.current} />
      {
        React.cloneElement(children[step.current],
          {
            nextStep: step.nextStep,
            prevStep: step.prevStep,
            ...step.data[step.current],
          })
      }
    </section>);
  }
}

export default MultiStep;
