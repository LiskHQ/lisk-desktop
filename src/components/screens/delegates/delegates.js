import React, { useState } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useDispatch } from 'react-redux';
import styles from './delegates.css';
import DelegatesTable from './table';
import Header from './header';
import Onboarding from '../../toolbox/onboarding/onboarding';
import { getTotalActions } from '../../../utils/voting';
import { clearVotes } from '../../../actions/voting';

const getOnboardingSlides = t => (
  [{
    title: t('Welcome to Lisk Delegates!'),
    content: t('Lisk\'s blockchain is based on the Delegated Proof of Stake (DPoS) consensus algorithm, in which 101 delegates are voted in by token holders to secure the network.'),
    illustration: 'welcomeLiskDelegates',
  }, {
    title: t('Your voice matters'),
    content: t('Voting for delegates gives Lisk users the opportunity to choose who they trust to secure the network and validate the transactions that are sent on it.'),
    illustration: 'yourVoiceMatters',
  }, {
    title: t('Casting a vote'),
    content: t('We encourage community members to research individual delegate contributions to the Lisk ecosystem before voting. There are several community created sites which can assist with the process.'),
    illustration: 'getRewarded',
  }, {
    title: t('Expand your knowledge'),
    content: t('Want to know more? We’ve got you covered. Read more about Lisk’s consensus algorithm and its benefits in the Lisk Academy.'),
    illustration: 'expandYourKnowledge',
  }]
);

const Delegates = ({
  votes, delegates, t,
}) => {
  const [votingMode, setVotingMode] = useState(getTotalActions(votes) > 0);
  const [onBoardingToggled, setOnBoardingToggled] = useState(false);
  const dispatch = useDispatch();
  // eslint-disable-next-line prefer-const
  let wrapper = React.createRef();

  const toggleVotingMode = () => {
    if (votingMode) {
      dispatch(clearVotes());
    }
    setVotingMode(!votingMode);
  };

  const onBoardingDiscarded = () => {
    setOnBoardingToggled(!onBoardingToggled);
  };

  return (
    <div className={`${grid.row} ${styles.wrapper}`} ref={wrapper}>
      <Onboarding
        slides={getOnboardingSlides(t)}
        finalCallback={toggleVotingMode}
        onDiscard={onBoardingDiscarded}
        actionButtonLabel={t('Start voting')}
        name="delegateOnboarding"
      />
      <Header
        t={t}
        votingModeEnabled={votingMode}
        toggleVotingMode={toggleVotingMode}
        votes={votes}
        onBoardingDiscarded={onBoardingDiscarded}
      />
      <section className={`${grid['col-sm-12']} ${grid['col-md-12']} ${styles.votingBox} ${styles.votes}`}>
        <DelegatesTable
          delegates={delegates}
          votingModeEnabled={votingMode}
          votes={votes}
        />
      </section>
    </div>
  );
};

export default Delegates;
