import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './votingV2.css';
import VotingListViewV2 from '../votingListViewV2';
import VotingHeader from './votingHeader';
import Onboarding from '../toolbox/onboarding/onboarding';
import { delegateOnboarding } from '../../utils/illustrations';

class VotingV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votingModeEnabled: false,
      showVotingOnboarding: !localStorage.getItem('closedVotingOnboarding'),
    };

    this.toggleVotingMode = this.toggleVotingMode.bind(this);
    this.getOnboardingSlides = this.getOnboardingSlides.bind(this);
    this.handleCloseOnboarding = this.handleCloseOnboarding.bind(this);
    this.handleOnboardingFinalCallback = this.handleOnboardingFinalCallback.bind(this);
  }

  setLayover(isLayover) {
    if (isLayover && this.root) {
      this.root.classList.add(styles.hasLayover);
    } else if (!isLayover && this.root) {
      this.root.classList.remove(styles.hasLayover);
    }
  }

  toggleVotingMode() {
    if (this.state.votingModeEnabled) {
      this.props.clearVotes();
    }
    this.setState({ votingModeEnabled: !this.state.votingModeEnabled });
  }

  handleCloseOnboarding() {
    localStorage.setItem('closedVotingOnboarding', true);
    this.setState({ showVotingOnboarding: false });
  }

  handleOnboardingFinalCallback() {
    this.handleCloseOnboarding();
    this.toggleVotingMode();
  }

  getOnboardingSlides() {
    const { t } = this.props;
    return [{
      title: t('Welcome to Lisk Delegates!'),
      content: t('Lisk blockchain network is based on a Delegated Proof of Stake consensus algorithm, in which 101 delegates are chosen to run the network by the community.'),
      illustration: delegateOnboarding.welcomeLiskDelegates,
    }, {
      title: t('Your voice matters'),
      content: t('In this section of Lisk Hub you can vote for up to 101 delegates to run Lisk’s blockchain network and by doing so have a real impact on the Lisk ecosystem.'),
      illustration: delegateOnboarding.yourVoiceMatters,
    }, {
      title: t('Get rewarded by the community'),
      content: t('Some delegates offer to share a certain percentage of their earnings from running the network with the users who vote for them. You can find more information on Lisk’s Reddit or Rocketchat.'),
      illustration: delegateOnboarding.getRewarded,
    }, {
      title: t('Expand your knowledge'),
      content: t('Want to dig deeper? We got you covered. You can read more about Lisk’s delgates, voting mechanism and benefits in a dedicated section of Lisk’s help centre.'),
      illustration: delegateOnboarding.expandYourKnowledge,
    }];
  }

  render() {
    const { t, votes } = this.props;
    const { votingModeEnabled, showVotingOnboarding } = this.state;

    return (
      <div className={`${grid.row} ${styles.wrapper}`} ref={(el) => { this.root = el; }}>
        { showVotingOnboarding ? (
          <Onboarding
            slides={this.getOnboardingSlides()}
            finalCallback={this.handleOnboardingFinalCallback}
            ctaLabel={t('Start voting')}
            onClose={this.handleCloseOnboarding}
          />
        ) : null}
        <VotingHeader
          t={t}
          votingModeEnabled={votingModeEnabled}
          toggleVotingMode={this.toggleVotingMode}
          votes={votes}/>
        <section className={`${grid['col-sm-12']} ${grid['col-md-12']} ${styles.votingBox} ${styles.votes}`}>
          <VotingListViewV2
            votingModeEnabled={votingModeEnabled}
            history={this.props.history}
          />
        </section>
      </div>
    );
  }
}

export default VotingV2;
