import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './voting.css';
import DelegateSidebar from '../delegateSidebar';
import VotingListView from '../votingListView';

class Voting extends React.Component {
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
        <aside className={`${grid['col-sm-12']} ${grid['col-md-4']} ${styles.votingBox} ${styles.sideBar}`}>
          <DelegateSidebar votes={this.props.votes}
            nextStepGotCalled={this.nextStepGotCalled.bind(this)}
            setLayover={this.setLayover.bind(this)}
            updateList={(value) => { this.toggleSummery(value); }} />
        </aside>
        <section className={`${grid['col-sm-12']} ${grid['col-md-8']} ${styles.votingBox} ${styles.votes}`}>
          <VotingListView showChangeSummery={this.state.showChangeSummery}
            nextStepCalled={this.state.nextStepCalled}
            history={this.props.history}
          />
        </section>
      </div>
    );
  }
}

export default Voting;
