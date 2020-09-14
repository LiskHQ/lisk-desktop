import React, { useEffect } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Box from '../../../toolbox/box';
import styles from './delegateProfile.css';
import DetailsView from './detailsView';
import PerformanceView from './performanceView';
import DelegateVotesView from './delegateVotesView';

const DelegateProfile = ({
  delegate, address, t, voters,
}) => {
  useEffect(() => {
    delegate.loadData();
    voters.loadData();
  }, [address]);

  return (
    <section className={`${styles.ontainer} container`}>
      <Box className={`${grid.row} ${styles.statsContainer} stats-container`}>
        <DetailsView
          t={t}
          voteWeight={delegate.data.totalVotesReceived}
        />
        <PerformanceView
          t={t}
          productivity={delegate.data.productivity}
          forgedBlocks={delegate.data.producedBlocks}
          missedBlocks={delegate.data.missedBlocks}
        />
        {voters.data.voters && <DelegateVotesView t={t} voters={voters.data.voters} />}
      </Box>
    </section>
  );
};
export default DelegateProfile;
