import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './votingV2.css';
import VotingListViewV2 from '../votingListViewV2';

class VotingV2 extends React.Component {
  constructor() {
    super();
    this.state = {
      showChangeSummery: false,
      nextStepCalled: false,
    };
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

  render() {
    return (
      <div className={`${grid.row} ${styles.wrapper}`} ref={(el) => { this.root = el; }}>
        <section className={`${grid['col-sm-12']} ${grid['col-md-12']} ${styles.votingBox} ${styles.votes}`}>
          <VotingListViewV2 showChangeSummery={this.state.showChangeSummery}
            nextStepCalled={this.state.nextStepCalled}
            history={this.props.history}
          />
        </section>
      </div>
    );
  }
}

export default VotingV2;
