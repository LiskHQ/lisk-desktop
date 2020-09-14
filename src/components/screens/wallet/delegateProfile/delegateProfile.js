import React, { useEffect } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Box from '../../../toolbox/box';
import styles from './delegateProfile.css';
import DetailsView from './detailsView';
import PerformanceView from './performanceView';
// import DelegateVotesView from './delegateVotesView';

const DelegateProfile = ({
  delegate, lastBlock, txDelegateRegister, address, t,
}) => {
  useEffect(() => {
    delegate.loadData();
    txDelegateRegister.loadData();
  }, [address]);

  useEffect(() => {
    if (delegate.data.username) {
      lastBlock.loadData({
        generatorPublicKey: delegate.data.publicKey,
        limit: 1,
      });
    }
  }, [delegate.data.username]);

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
        {/* <DelegateVotesView t={t} votes={delegate.votes} /> */}
      </Box>
    </section>
  );
};
export default DelegateProfile;
