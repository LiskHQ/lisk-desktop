import React, { Fragment } from 'react';
import DelegateRowV2 from './delegateRowV2';
import { Button } from '../toolbox/buttons/button';

import styles from './votingListViewV2.css';

class DelegateListV2 extends React.Component {
  constructor() {
    super();
    this.state = { didMount: false };
  }

  componentWillUpdate(nextProps) {
    if (this.props.showChangeSummery === false && nextProps.showChangeSummery === true) {
      this.props.nextStep();
    }
  }

  componentDidMount() {
    this.setState({ didMount: true });
  }

  render() {
    return (<Fragment>
      {
        this.state.didMount ?
          this.props.list.map(item =>
            <DelegateRowV2 key={item.account.address} data={item}
              className={this.props.safari}
              voteToggled={this.props.voteToggled}
              voteStatus={this.props.votes[item.username]}
            />) : null
      }
      <Button
        className={`${styles.loadMore} loadMore`}
        type='button'
        onClick={() => this.props.loadMore()}>
        {this.props.t('Load More')}
        </Button>
    </Fragment>);
  }
}

export default DelegateListV2;
