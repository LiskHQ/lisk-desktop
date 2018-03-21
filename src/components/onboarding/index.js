import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Joyride from 'react-joyride';
import throttle from 'lodash.throttle';
import { FontIcon } from '../fontIcon';
import { styles, steps } from './steps';
import breakpoints from './../../constants/breakpoints';

class Onboarding extends React.Component {
  constructor(props) {
    super(props);

    this.onboardingStarted = false;
    this.onboardingFinished = false;
    this.state = {
      isDesktop: window.innerWidth > breakpoints.m,
      steps: [],
      needsOnboarding: false,
      start: false,
      intro: true,
      skip: false,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', throttle(this.resizeWindow.bind(this), 1000));

    const onboarding = window.localStorage.getItem('onboarding');

    if (this.props.showDelegates) {
      steps(this.props.t).splice(7, 0, {
        title: this.props.t('Delegate voting'),
        text: this.props.t('View forging delegates and vote for the ones you support.'),
        selector: '#voting',
        position: 'right',
        style: styles.step,
      });
    }
    this.setState({ steps: steps(this.props.t), needsOnboarding: onboarding !== 'false' });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow.bind(this));
  }

  resizeWindow() {
    this.setState({ isDesktop: window.innerWidth > breakpoints.m });
  }

  // eslint-disable-next-line class-methods-use-this
  onboardingCallback(data) {
    if (data.index === 0 && !this.onboardingStarted) {
      this.joyride.next();
    }
    if (data.index === 1) {
      this.onboardingStarted = true;

      if (data.action === 'skip') {
        this.setState({ skip: true });
        this.joyride.reset(true);
      }
    }
    if (data.index > 1) {
      this.setState({ intro: false });
    }
    if (data.type === 'finished') {
      window.localStorage.setItem('onboarding', 'false');

      if (this.onboardingFinished) this.setState({ start: false });
      this.onboardingFinished = true;
    }
  }
  render() {
    const { isDesktop, start, needsOnboarding, skip, intro } = this.state;
    if (!isDesktop && start) this.setState({ start: false });

    return <Joyride
      ref={(el) => { this.joyride = el; }}
      steps={this.state.steps}
      run={this.props.isAuthenticated && isDesktop && (start || needsOnboarding)}
      locale={{
        last: (<span>{this.props.t('Complete')}</span>),
        skip: skip ? <span>{this.props.t('Use Lisk App')}</span> : <span>{this.props.t('Click here to skip')}</span>,
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
