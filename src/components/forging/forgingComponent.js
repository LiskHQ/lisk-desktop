import React from 'react';
import { Card } from 'react-toolbox/lib/card';
import Waypoint from 'react-waypoint';
import { getForgedBlocks, getForgedStats } from '../../utils/api/forging';
import ForgingTitle from './forgingTitle';
import DelegateStats from './delegateStats';
import ForgingStats from './forgingStats';
import ForgedBlocks from './forgedBlocks';

class ForgingComponent extends React.Component {
  loadStats(key, startMoment) {
    getForgedStats(this.props.peers.data, startMoment, this.props.account.publicKey,
    ).then((data) => {
      this.props.onForgingStatsUpdate({ [key]: data.forged });
    });
  }

  loadForgedBlocks(activePeer, limit, offset, generatorPublicKey) {
    getForgedBlocks(activePeer, limit, offset, generatorPublicKey).then((data) => {
      this.props.onForgedBlocksLoaded(data.blocks);
    });
  }

  render() {
    return (
      <Card style={{ padding: 8 }}>
        {this.props.account && this.props.account.isDelegate ?
          <div>
            <ForgingTitle account={this.props.account} statistics={this.props.statistics}
              loadStats={this.loadStats.bind(this)} />
            <br />
            <ForgingStats account={this.props.account} statistics={this.props.statistics}
              loadStats={this.loadStats.bind(this)} />
            <br />
            <DelegateStats delegate={this.props.account.delegate} />
            <br />
            <ForgedBlocks forgedBlocks={this.props.forgedBlocks} />
            <Waypoint onEnter={() => this.loadForgedBlocks(
              this.props.peers.data,
              20,
              this.props.forgedBlocks.length,
              this.props.account.publicKey,
            ) } />
          </div> :
          null
        }
        {this.props.account && this.props.account.delegate && !this.props.account.isDelegate ?
          <p>
            You need to become a delegate to start forging.
            If you already registered to become a delegate,
            your registration hasn't been processed, yet.
          </p> :
          null
        }
      </Card>
    );
  }
}

export default ForgingComponent;
