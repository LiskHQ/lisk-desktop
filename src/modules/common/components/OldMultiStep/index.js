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
 */
class MultiStep extends React.Component {
  constructor() {
    super();

    this.state = {
      step: {
        nextStep: (data, jump) => {
          this.next(data, jump);
        },
        prevStep: (data) => {
          this.prev(data);
        },
        data: [{}],
        current: 0,
      },
    };
  }

  next(data, jump = 1) {
    const newState = { ...this.state };
    newState.step.current += jump;
    newState.step.data[newState.step.current] = data;
    if (this.props.children[newState.step.current]) {
      this.setState(newState);
      this.props.onChange?.(newState);
    }
  }

  prev(config) {
    const getTarget = (current) => {
      if (current === 0) return current;
      if (config?.jump) return current - config.jump;
      if (!config || !config.reset) return current - 1;
      return 0;
    };
    const newState = { ...this.state };
    newState.step.current =
      config?.step || config?.step === 0 ? config.step : getTarget(this.state.step.current);
    newState.step.data = config?.reset && !config.amount ? [{}] : newState.step.data;
    this.setState(newState);
    this.props.onChange?.(newState);
  }

  reset() {
    this.prev({ reset: true });
    this.props.onChange?.(this.state);
  }

  render() {
    const { children, className, finalCallback, browsable, backButtonLabel, prevPage } = this.props;
    const { step } = this.state;
    const extraProps = {
      nextStep: step.nextStep,
      prevStep: step.prevStep,
      reset: this.reset.bind(this),
      ...step.data[step.current],
      finalCallback,
    };

    extraProps.prevState = { ...step.data[step.current + 1] };
    return (
      <div className={className}>
        <MultiStepNav
          steps={children}
          showNav={this.props.showNav}
          prevPage={prevPage}
          browsable={browsable}
          backButtonLabel={backButtonLabel}
          current={step.current}
          prevStep={step.prevStep}
        />
        {React.cloneElement(children[step.current], extraProps)}
      </div>
    );
  }
}

export default MultiStep;
