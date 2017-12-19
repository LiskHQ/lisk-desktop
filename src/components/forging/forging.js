import React from 'react';
import Waypoint from 'react-waypoint';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import ForgingTitle from './forgingTitle';
import DelegateStats from './delegateStats';
import ForgingStats from './forgingStats';
import ForgedBlocks from './forgedBlocks';
import Box from '../box';

const Forging = ({
  account, statistics, forgedBlocks, peers, onForgedBlocksLoaded, onForgingStatsUpdated, t,
}) => {
  const loadStats = (key, startMoment) => {
    onForgingStatsUpdated({
      activePeer: peers.data,
      key,
      startMoment,
      generatorPublicKey: account.publicKey,
    });
  };

  const loadForgedBlocks = (limit, offset) => {
    onForgedBlocksLoaded({
      activePeer: peers.data,
      limit,
      offset,
      generatorPublicKey: account.publicKey,
    });
  };


  return (
    <Box>
      {account && account.isDelegate ?
        <div className={grid['col-xs-12']}>
          <ForgingTitle account={account} statistics={statistics}
            loadStats={loadStats} />
          <br />
          <ForgingStats account={account} statistics={statistics}
            loadStats={loadStats} />
          <br />
          <DelegateStats delegate={account.delegate} />
          <br />
          <ForgedBlocks forgedBlocks={forgedBlocks} />
          <Waypoint bottomOffset='-80%'
            // scrollableAncestor={window}
            key={forgedBlocks.length}
            onEnter={() => loadForgedBlocks(20, forgedBlocks.length) } />
        </div> :
        null
      }
      {account && account.delegate && !account.isDelegate ?
        <p>
          {t('You need to become a delegate to start forging. If you already registered to become a delegate, your registration hasn\'t been processed, yet.')}
        </p> :
        null
      }
    </Box>
  );
};

export default Forging;
