import React from 'react';
import { connect } from 'react-redux';
import Joyride from 'react-joyride';
import { FontIcon } from '../fontIcon';
import steps from './steps';

class Onboarding extends React.Component {
  constructor(props) {
    super(props);

    this.onboardingStarted = false;
    this.onboardingFinished = false;
    this.state = {
      steps: [],
      needsOnboarding: false,
      start: false,
      intro: true,
      skip: false,
    };
  }

  componentDidMount() {
    const onboarding = window.localStorage.getItem('onboarding');
    this.setState({ steps, needsOnboarding: onboarding !== 'false' });
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
    return <Joyride
      ref={(el) => { this.joyride = el; }}
      steps={this.state.steps}
      run={this.props.isAuthenticated && (this.state.start || this.state.needsOnboarding)}
      locale={{
        last: (<span>Complete</span>),
        skip: this.state.skip ? <span>Use Lisk App</span> : <span>Click here to skip</span>,
        next: this.state.intro ? <span>See how it works</span> : <span>Next <FontIcon value='arrow-right'/></span>,
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
});

export default connect(mapStateToProps, null, null, { withRef: true })(Onboarding);
