import React, { useEffect } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Box from '@toolbox/box';
import styles from './delegateProfile.css';
import DetailsView from './detailsView';
import PerformanceView from './performanceView';
// import DelegateVotesView from './delegateVotesView';

// const formatForgingStatus = (status) => {
//   const result = status.replace(/([A-Z])/g, ' $1');
//   return result.charAt(0).toUpperCase() + result.slice(1);
// };

// const getDelegateStatus = (awaitingForgers, forgingTimes, delegateAddress) => {
//   const matchingForger = awaitingForgers.filter(forger => forger.address === delegateAddress);
//   if (matchingForger.length && forgingTimes) {
//     const publicKey = matchingForger.publicKey;
//     const status = forgingTimes[publicKey].status;
//     return formatForgingStatus(status);
//   }
//   return undefined;
// };

const DelegateProfile = ({
  delegate, address, t, voters,
  // awaitingForgers, forgingTimes,
  lastBlockForged,
}) => {
  useEffect(() => {
    delegate.loadData();
    voters.loadData();
  }, [address]);

  useEffect(() => {
    lastBlockForged.loadData({ height: delegate.data.dpos?.delegate?.lastForgedHeight });
  }, [delegate.data.dpos?.delegate?.lastForgedHeight]);

  return (
    <section className={`${styles.container} container`}>
      <Box className={`${grid.row} ${styles.statsContainer} stats-container`}>
        <DetailsView
          t={t}
          status={delegate.data.dpos?.delegate?.status}
          lastBlockForged={lastBlockForged.data.timestamp}
          voteWeight={delegate.data.dpos?.delegate?.totalVotesReceived}
          rank={delegate.data.dpos?.delegate?.rank}
        />
        <PerformanceView
          t={t}
          productivity={delegate.data.dpos?.delegate?.productivity}
          forgedBlocks={delegate.data.dpos?.delegate?.producedBlocks}
          missedBlocks={delegate.data.dpos?.delegate?.missedBlocks}
          forgedLsk="-"
        />
      </Box>
      {/* <DelegateVotesView
        t={t}
        voters={voters}
      /> */}
    </section>
  );
};

export default DelegateProfile;
