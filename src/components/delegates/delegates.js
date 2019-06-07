import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './delegates.css';
import DelegatesListView from '../delegatesListView';
import VotingHeader from './votingHeader';
import Onboarding from '../toolbox/onboarding/onboarding';
import { getTotalActions } from './../../utils/voting';

class Delegates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      votingModeEnabled: getTotalActions(props.votes) > 0,
    };

    this.toggleVotingMode = this.toggleVotingMode.bind(this);
    this.getOnboardingSlides = this.getOnboardingSlides.bind(this);
  }

  toggleVotingMode() {
    if (this.state.votingModeEnabled) {
      this.props.clearVotes();
    }
    this.setState({ votingModeEnabled: !this.state.votingModeEnabled });
  }

  getOnboardingSlides() {
    const { t } = this.props;
    return [{
      title: t('Welcome to Lisk Delegates!'),
      content: t('Lisk blockchain network is based on a Delegated Proof of Stake consensus algorithm, in which 101 delegates are elected by the community to secure the network.'),
      illustration: 'welcomeLiskDelegates',
    }, {
      title: t('Your voice matters'),
      content: t('In this section of Lisk Hub you can vote for up to 101 delegates to secure Lisk’s blockchain network. By doing so you have a real impact on the Lisk ecosystem.'),
      illustration: 'yourVoiceMatters',
    }, {
      title: t('Get rewarded by the community'),
      content: t('Some delegates offer to share a percentage of their earnings from running the network with the users who vote for them.'),
      illustration: 'getRewarded',
    }, {
      title: t('Expand your knowledge'),
      content: t('You can find out more about Lisk’s delgates, voting mechanism and benefits in a dedicated section of Lisk’s help centre.'),
      illustration: 'expandYourKnowledge',
    }];
  }
  render() {
    const { t, votes, account } = this.props;
    const { votingModeEnabled } = this.state;
    return (
      <div className={`${grid.row} ${styles.wrapper}`} ref={(el) => { this.root = el; }}>
        { account && account.address ?
          <Onboarding
            slides={this.getOnboardingSlides()}
            finalCallback={this.toggleVotingMode}
            actionButtonLabel={t('Start voting')}
            name={'delegateOnboarding'}
          /> :
          null
        }
        <VotingHeader
          t={t}
          votingModeEnabled={votingModeEnabled}
          toggleVotingMode={this.toggleVotingMode}
          account={account}
          votes={votes}/>
        <section className={`${grid['col-sm-12']} ${grid['col-md-12']} ${styles.votingBox} ${styles.votes}`}>
          <DelegatesListView
            votingModeEnabled={votingModeEnabled}
          />
        </section>
      </div>
    );
  }
}

export default Delegates;
