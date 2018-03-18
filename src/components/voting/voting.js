import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './voting.css';
import DelegateSidebar from '../delegateSidebar';
import DelegateList from '../delegateList';

class Voting extends React.Component {
  constructor() {
    super();
    this.state = {
      showChangeSummery: false,
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

  render() {
    return (
      <div className={`${grid.row} ${styles.wrapper}`} ref={(el) => { this.root = el; }}>
        <aside className={`${grid['col-sm-12']} ${grid['col-md-4']} ${styles.votingBox}`}>
          <DelegateSidebar votes={this.props.votes}
            setLayover={this.setLayover.bind(this)}
            updateList={(value) => { this.toggleSummery(value); }}
            history={this.props.history} />
        </aside>
        <section className={`${grid['col-sm-12']} ${grid['col-md-8']} ${styles.votingBox}`}>
          <DelegateList showChangeSummery={this.state.showChangeSummery} />
        </section>
      </div>
    );
  }
}

export default Voting;
