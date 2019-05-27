import React from 'react';
import DelegateRowV2 from './delegateRowV2';
import ListLabelsV2 from './listLabelsV2';
import { Button } from '../toolbox/buttons/button';
import { getTotalVotesCount } from './../../utils/voting';

import styles from './votingListViewV2.css';

class DelegateListV2 extends React.Component {
  constructor() {
    super();
    this.state = { didMount: false };
  }

  componentDidMount() {
    this.setState({ didMount: true });
  }

  render() {
    const { votingModeEnabled, votes, firstTimeVotingActive } = this.props;
    const shouldLoadMore = this.props.list.length > 0 &&
      this.props.list[this.props.list.length - 1].rank % 100 === 0;
    const shouldShowVoteColumn = votingModeEnabled || getTotalVotesCount(votes) >= 0;
    return (<div>
      { this.state.didMount ? <div className={`${styles.results} transaction-results`}>
        <ListLabelsV2 t={this.props.t} shouldShowVoteColumn={shouldShowVoteColumn} />
        {
            this.props.list.map(item =>
              <DelegateRowV2 key={item.account.address} data={item}
                t={this.props.t}
                className={this.props.safari}
                voteToggled={this.props.voteToggled}
                voteStatus={votes[item.username]}
                votingModeEnabled={votingModeEnabled}
                shouldShowVoteColumn={shouldShowVoteColumn}
                shouldHightlightCheckbox={firstTimeVotingActive}
              />)
        }
        {shouldLoadMore ? <Button
          className={`${styles.loadMore} loadMore`}
          type='button'
          onClick={() => this.props.loadMore()}>
          {this.props.t('Load More')}
        </Button> : null}
      </div> : null}
    </div>);
  }
}

export default DelegateListV2;
