import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './votingV2.css';
import VotingListViewV2 from '../votingListViewV2';
import VotingHeader from './votingHeader';

class VotingV2 extends React.Component {
  constructor() {
    super();
    this.state = {
      showChangeSummery: false,
      nextStepCalled: false,
      votingModeEnabled: false,
    };

    this.toggleVotingMode = this.toggleVotingMode.bind(this);
  }

  toggleSummery(value) {
    if (value !== this.state.showChangeSummery) {
      this.setState({
        showChangeSummery: value,
      });
    }
  }

  setLayover(isLayover) {
    if (isLayover && this.root) {
      this.root.classList.add(styles.hasLayover);
    } else if (!isLayover && this.root) {
      this.root.classList.remove(styles.hasLayover);
    }
  }

  nextStepGotCalled() {
    this.setState({ nextStepCalled: true });
  }

  toggleVotingMode() {
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
          <VotingListViewV2 showChangeSummery={this.state.showChangeSummery}
            votingModeEnabled={votingModeEnabled}
            nextStepCalled={this.state.nextStepCalled}
            history={this.props.history}
          />
        </section>
      </div>
    );
  }
}

export default VotingV2;
