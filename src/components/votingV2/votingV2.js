import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './votingV2.css';
import VotingListViewV2 from '../votingListViewV2';
import Onboarding from '../toolbox/onboarding/onboarding';
import illustration from '../../assets/images/illustrations/illustration-welcome-to-lisk-delegates-dark.svg';

class VotingV2 extends React.Component {
  constructor() {
    super();
    this.state = {
      showChangeSummery: false,
      nextStepCalled: false,
    };

    this.getOnboardingSlides = this.getOnboardingSlides.bind(this);
  }

  toggleSummery(value) {
    if (value !== this.state.showChangeSummery) {
      this.setState({
        showChangeSummery: value,
      });
    }
  }

  setLayover(isLayover) {
    if (isLayover && this.root) {
      this.root.classList.add(styles.hasLayover);
    } else if (!isLayover && this.root) {
      this.root.classList.remove(styles.hasLayover);
    }
  }

  nextStepGotCalled() {
    this.setState({ nextStepCalled: true });
  }

  getOnboardingSlides() {
    const { t } = this.props;
    return [{
      title: t('Welcome to Lisk Delegates!'),
      content: t('Lisk blockchain network is based on a Delegated Proof of Stake consensus algorithm, in which 101 delegates are chosen to run the network by the community.'),
      illustration,
    }, {
      title: t('Your voice matters'),
      content: t('In this section of Lisk Hub you can vote for up to 101 delegates to run Lisk’s blockchain network and by doing so have a real impact on the Lisk ecosystem.'),
    }, {
      title: t('Get rewarded by the community'),
      content: t('Some delegates offer to share a certain percentage of their earnings from running the network with the users who vote for them. You can find more information on Lisk’s Reddit or Rocketchat.'),
    }, {
      title: t('Expand your knowledge'),
      content: t('Want to dig deeper? We got you covered. You can read more about Lisk’s delgates, voting mechanism and benefits in a dedicated section of Lisk’s help centre.'),
    }];
  }

  render() {
    const { t } = this.props;
    return (
      <div className={`${grid.row} ${styles.wrapper}`} ref={(el) => { this.root = el; }}>
        <Onboarding />
        <Onboarding
          slides={this.getOnboardingSlides()}
          finalCallback={console.log}
          ctaLabel={t('Start voting')}
          onClose={console.log}
        />
        <section className={`${grid['col-sm-12']} ${grid['col-md-12']} ${styles.votingBox} ${styles.votes}`}>
          <VotingListViewV2 showChangeSummery={this.state.showChangeSummery}
            nextStepCalled={this.state.nextStepCalled}
            history={this.props.history}
          />
        </section>
      </div>
    );
  }
}

export default VotingV2;
