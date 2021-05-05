import React, { useEffect } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Box from '@toolbox/box';
import styles from './delegateProfile.css';
import DetailsView from './detailsView';
import PerformanceView from './performanceView';
import DelegateVotesView from './delegateVotesView';

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
  delegate, account, t, voters,
  lastBlockForged,
  // forgers,
}) => {
  const { data } = delegate;
  useEffect(() => {
    voters.loadData();
  }, [account]);

  useEffect(() => {
    if (data.dpos?.delegate?.lastForgedHeight) {
      lastBlockForged.loadData({ height: data.dpos.delegate.lastForgedHeight });
    }
  }, [data.dpos?.delegate?.lastForgedHeight]);

  if (!data.dpos?.delegate) {
    return null;
  }

  return (
    <section className={`${styles.container} container`}>
      <Box className={`${grid.row} ${styles.statsContainer} stats-container`}>
        <DetailsView
          t={t}
          status={data.dpos?.delegate?.status}
          lastBlockForged={lastBlockForged.data.timestamp}
          delegateWeight={data.dpos?.delegate?.totalVotesReceived}
          rank={data.dpos?.delegate?.rank}
        />
        <PerformanceView
          t={t}
          productivity={data.dpos?.delegate?.productivity}
          lastForgedBlocks={data.dpos?.delegate?.lastForgedHeight}
          consecutiveMissedBlocks={data.dpos?.delegate?.consecutiveMissedBlocks}
          forgedLsk="-"
        />
      </Box>
      <DelegateVotesView
        t={t}
        voters={voters}
      />
    </section>
  );
};

export default DelegateProfile;
