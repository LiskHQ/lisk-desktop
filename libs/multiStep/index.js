import React from 'react';
import { getStyles } from './utils';
import Nav from './navigator';
import { Element } from './element';

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
  state = {
    key: 0,
    data: {},
    current: 0,
    origin: 0,
  };

  next = (data) => {
    this.move({ moves: 1, data });
  };

  /**
   *
   * @param {Object} config
   * @param {Number} config.jump - The number of steps to jump back
   * @param {Boolean} config.reset - Should return to first step,
   *    this overrides all other configurations
   * @param {Number} config.to - The index of the step to go to
   * @memberOf MultiStep
   *
   */
  prev = (moves = -1) => {
    // On Lisk Desktop this function is not passed a number by default
    const stepsBack = typeof moves === 'number' ? moves : -1;
    this.move({ moves: stepsBack });
  };

  reset = (data = {}) => {
    this.move({ to: 0, data, reset: true });
  };

  // eslint-disable-next-line class-methods-use-this
  keepTargetInRange(target, moves, current, totalSteps) {
    if (typeof target === 'number') {
      return Math.max(Math.min(target, totalSteps - 1), 0);
    }
    return moves > 0
      ? Math.min(current + moves, totalSteps - 1)
      : Math.max(0, current + moves);
  }

  move = ({
    moves, to, data, reset = false,
  }) => {
    const { key, current } = this.state;
    const { children } = this.props;
    const next = this.keepTargetInRange(to, moves, current, children.length);

    this.setState({
      current: next,
      data: data || this.state.data,
      origin: current,
      key: reset ? key + 1 : key, // re-mounts child component.
    });
  };

  render() {
    const {
      children,
      finalCallback,
      backButtonTitle,
      showNav,
      navStyles,
      interactive,
      backButton,
      prevPage,
      hideGroups,
      hideSteps,
      activeTitle,
      navigatorButton,
      groupButton,
      stepButton,
      progressBar,
    } = this.props;

    const { key, data, current } = this.state;
    const extraProps = {
      nextStep: this.next,
      move: this.move,
      prevStep: this.prev,
      sharedData: data,
    };

    if (current === children.length - 2) {
      if (typeof finalCallback === 'function') {
        extraProps.finalCallback = finalCallback;
      }
      extraProps.reset = this.reset;
    }

    const normalizedStyles = navStyles && getStyles(navStyles);
    const ProgressBar = progressBar;

    return (
      <Element {...normalizedStyles?.multiStepWrapper} key={key}>
        {showNav ? (
          <Nav
            normalizedStyles={normalizedStyles}
            hideGroups={hideGroups}
            hideSteps={hideSteps}
            steps={children}
            groupButton={groupButton}
            stepButton={stepButton}
            interactive={interactive}
            current={current}
            activeTitle={activeTitle}
            navigatorButton={navigatorButton}
            backButton={backButton}
            backButtonTitle={backButtonTitle}
            prevPage={prevPage}
            prevStep={this.prev}
            move={this.move}
          />
        ) : null}
        {ProgressBar && (
          <ProgressBar
            current={current}
            total={children.length}
          />
        )}
        {React.cloneElement(children[current], extraProps)}
      </Element>
    );
  }
}

export default MultiStep;
