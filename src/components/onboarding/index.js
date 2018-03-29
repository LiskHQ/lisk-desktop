import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Joyride from 'react-joyride';
import throttle from 'lodash.throttle';
import { FontIcon } from '../fontIcon';
import { steps } from './steps';
import breakpoints from './../../constants/breakpoints';

class Onboarding extends React.Component {
  constructor(props) {
    super(props);

    this.onboardingStarted = false;
    this.isAlreadyOnboarded = window.localStorage.getItem('onboarding') === 'false';

    this.state = {
      isDesktop: window.innerWidth > breakpoints.m,
      start: false,
      intro: true,
      skip: false,
      steps: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.appLoaded && !this.stepsAdded)
      || this.props.showDelegates !== nextProps.showDelegates) {
      this.addSteps(nextProps.showDelegates);
    }
  }

  componentDidMount() {
    window.addEventListener('resize', throttle(this.resizeWindow.bind(this), 1000));

    if (this.props.appLoaded) {
      this.addSteps(this.props.showDelegates);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow.bind(this));
  }

  resizeWindow() {
    this.setState({ isDesktop: window.innerWidth > breakpoints.m });
  }

  addSteps(showDelegates) {
    let newSteps = steps(this.props.t);
    if (!showDelegates) {
      newSteps = newSteps.filter(step => step.selector !== '#voting');
    }

    this.setState({ steps: newSteps });
    this.stepsAdded = true;
  }

  reset() {
    this.isAlreadyOnboarded = true;
    this.onboardingStarted = false;
    this.onboardingFinished = false;
    this.joyride.reset(true);
    this.setState({ start: false, intro: true, skip: false });
  }

  onboardingCallback(data) {
    // index 0 is the step you will see when you skip the onboarding
    const onboardingNotStarted = data.index === 0 && !this.onboardingStarted;
    const onboardingStarted = data.index === 1;
    const onboardingStep = data.index > 1;
    const skipOnboarding = data.action === 'skip';
    const lastStepReached = data.index === this.state.steps.length - 1;
    const onboardingFinished = data.type === 'finished';

    if (onboardingNotStarted) {
      this.joyride.next(); // skip to welcome step
    }
    if (onboardingStarted) {
      this.onboardingFinished = false;
      this.onboardingStarted = true;
    }
    if (onboardingStep) {
      this.setState({ intro: false });
    }
    if (skipOnboarding) {
      this.setState({ skip: true });
      this.joyride.reset(true); // go to step 0 to show the skip step
    }
    if (lastStepReached) {
      this.onboardingFinished = true;
    }
    if (onboardingFinished) {
      if (this.onboardingFinished) this.reset();
      this.onboardingFinished = true;
      window.localStorage.setItem('onboarding', 'false');
    }
  }

  render() {
    const { isDesktop, start, skip, intro } = this.state;
    if (!isDesktop && start) this.setState({ start: false });

    return <Joyride
      ref={(el) => { this.joyride = el; }}
      steps={this.state.steps}
      run={this.props.isAuthenticated && isDesktop && (start || !this.isAlreadyOnboarded)}
      locale={{
        last: (<span>{this.props.t('Complete')}</span>),
        skip: skip ? <span>{this.props.t('Use Lisk Hub')}</span> : <span>{this.props.t('Click here to skip')}</span>,
        next: intro ? <span>{this.props.t('Start the tour')}</span> : <span>{this.props.t('Next')} <FontIcon value='arrow-right'/></span>,
      }}
      callback={this.onboardingCallback.bind(this)}
      showOverlay={true}
      showSkipButton={true}
      autoStart={true}
      type='continuous'
      holePadding={0}
    />;
  }
}


const mapStateToProps = state => ({
  isAuthenticated: !!state.account.publicKey,
  showDelegates: state.settings.advancedMode,
});

export default connect(mapStateToProps, null, null, { withRef: true })(translate(null,
  { withRef: true })(Onboarding));
