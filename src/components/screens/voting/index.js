import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { withTranslation } from 'react-i18next';
import styles from './voting.css';
import DelegatesTable from './table';
import Header from './header';
import Onboarding from '../../toolbox/onboarding/onboarding';
import { clearVotes, loadVotes } from '../../../actions/voting';
import { getUnvoteList, getVoteList } from '../../../utils/voting';
import { selectSearchParamValue } from '../../../utils/searchParams';

const getOnboardingSlides = t => (
  [{
    title: t('Welcome to Lisk Delegates!'),
    content: t('Lisk\'s blockchain is based on the Delegated Proof of Stake (DPoS) consensus algorithm, in which 101 delegates are voted in by LSK holders to secure the network.'),
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
  t,
  history,
}) => {
  const votes = useSelector(state => state.voting.votes);
  const [votingMode, setVotingMode] = useState(
    getUnvoteList(votes).length + getVoteList(votes).length > 0,
  );
  const account = useSelector(state => state.account);
  const dispatch = useDispatch();
  // eslint-disable-next-line prefer-const
  let wrapper = React.createRef();
  const isSignedIn = account.info && account.info.LSK;

  const toggleVotingMode = () => {
    if (votingMode) {
      dispatch(clearVotes());
    }
    setVotingMode(!votingMode);
  };

  useEffect(() => {
    if (isSignedIn && !Object.keys(votes).length) {
      dispatch(loadVotes({
        address: account.info.LSK.address,
      }));
    }
  }, []);

  useEffect(() => {
    const modalSearchParam = selectSearchParamValue(history.location.search, 'modal');
    const isSubmittedSearchParam = selectSearchParamValue(history.location.search, 'isSubmitted');
    if (isSubmittedSearchParam === 'true' && modalSearchParam === 'votingSummary') {
      setVotingMode(false);
    }
  }, [history.location.search]);

  return (
    <div className={`${grid.row} ${styles.wrapper}`} ref={wrapper}>
      <Onboarding
        slides={getOnboardingSlides(t)}
        finalCallback={toggleVotingMode}
        actionButtonLabel={t('Start voting')}
        name="delegateOnboarding"
      />
      <Header
        t={t}
        votingModeEnabled={votingMode}
        toggleVotingMode={toggleVotingMode}
      />
      <section className={`${grid['col-sm-12']} ${grid['col-md-12']} ${styles.votingBox} ${styles.votes}`}>
        <DelegatesTable
          votingModeEnabled={votingMode}
          isSignedIn={isSignedIn}
        />
      </section>
    </div>
  );
};

export default compose(
  withRouter,
  withTranslation(),
)(Delegates);
