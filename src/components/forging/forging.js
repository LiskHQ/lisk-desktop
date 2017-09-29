import React from 'react';
import { Card } from 'react-toolbox/lib/card';
import Waypoint from 'react-waypoint';
import ForgingTitle from './forgingTitle';
import DelegateStats from './delegateStats';
import ForgingStats from './forgingStats';
import ForgedBlocks from './forgedBlocks';

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
    <Card style={{ padding: 8 }}>
      {account && account.isDelegate ?
        <div>
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
            scrollableAncestor={window}
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
    </Card>
  );
};

export default Forging;
