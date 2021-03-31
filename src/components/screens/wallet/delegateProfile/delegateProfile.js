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
  account, t, voters,
  // awaitingForgers, forgingTimes,
  lastBlockForged,
}) => {
  const { delegate } = account.dpos;
  useEffect(() => {
    voters.loadData();
  }, [account]);

  useEffect(() => {
	if(delegate?.lastForgedHeight) {
		lastBlockForged.loadData({ height: delegate.lastForgedHeight });
	}
  }, [delegate?.lastForgedHeight]);

  if (!delegate) {
    return null;
  }

  return (
    <section className={`${styles.container} container`}>
      <Box className={`${grid.row} ${styles.statsContainer} stats-container`}>
        <DetailsView
          t={t}
          status={delegate?.status}
          lastBlockForged={lastBlockForged.data.timestamp}
          delegateWeight={delegate?.totalVotesReceived}
          rank={delegate?.rank}
        />
        <PerformanceView
          t={t}
          forgedBlocks={delegate?.forgedBlocks}
          lastForgedBlocks={delegate?.lastForgedHeight}
          consecutiveMissedBlocks={delegate?.consecutiveMissedBlocks}
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
