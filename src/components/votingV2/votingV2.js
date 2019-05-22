import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './votingV2.css';
import VotingListViewV2 from '../votingListViewV2';
import VotingHeader from './votingHeader';
import { getTotalActions } from './../../utils/voting';

class VotingV2 extends React.Component {
  constructor({ votes }) {
    super();

    this.state = {
      votingModeEnabled: getTotalActions(votes) > 0,
    };

    this.toggleVotingMode = this.toggleVotingMode.bind(this);
  }

  toggleVotingMode() {
    if (this.state.votingModeEnabled) {
      this.props.clearVotes();
    }
    this.setState({ votingModeEnabled: !this.state.votingModeEnabled });
  }

  render() {
    const { t, votes } = this.props;
    const { votingModeEnabled } = this.state;
    return (
      <div className={`${grid.row} ${styles.wrapper}`} ref={(el) => { this.root = el; }}>
        <VotingHeader
          t={t}
          votingModeEnabled={votingModeEnabled}
          toggleVotingMode={this.toggleVotingMode}
          votes={votes}/>
        <section className={`${grid['col-sm-12']} ${grid['col-md-12']} ${styles.votingBox} ${styles.votes}`}>
          <VotingListViewV2
            votingModeEnabled={votingModeEnabled}
          />
        </section>
      </div>
    );
  }
}

export default VotingV2;
