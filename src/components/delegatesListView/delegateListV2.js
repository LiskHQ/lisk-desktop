import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
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
    const {
      votingModeEnabled,
      votes,
      firstTimeVotingActive,
      shouldLoadMore,
      t,
    } = this.props;

    const shouldShowVoteColumn = votingModeEnabled || getTotalVotesCount(votes) > 0;
    const columnClassNames = {
      vote: `${grid['col-md-1']} ${grid['col-xs-1']}`,
      rank: `${grid['col-md-1']} ${grid['col-xs-1']}`,
      delegate: `${grid[shouldShowVoteColumn ? 'col-md-5' : 'col-md-6']} ${grid['col-xs-4']}`,
      forged: `${grid['col-md-2']} ${grid['col-xs-2']}`,
      productivity: `${grid['col-md-1']} ${grid['col-xs-2']}`,
      voteWeight: `${grid['col-md-2']}`,
    };
    return (<div>
      { this.state.didMount ? <div className={`${styles.results} delegate-list`}>
        <ListLabelsV2
          t={t}
          columnClassNames={columnClassNames}
          shouldShowVoteColumn={shouldShowVoteColumn}
        />
        {
            this.props.list.map(item =>
              <DelegateRowV2 key={item.account.address} data={item}
                t={t}
                className={this.props.safari}
                voteToggled={this.props.voteToggled}
                voteStatus={votes[item.username]}
                votingModeEnabled={votingModeEnabled}
                shouldShowVoteColumn={shouldShowVoteColumn}
                shouldHightlightCheckbox={firstTimeVotingActive}
                columnClassNames={columnClassNames}
              />)
        }
        {shouldLoadMore ? <Button
          className={`${styles.loadMore} loadMore`}
          type='button'
          onClick={() => this.props.loadMore()}>
          {t('Load More')}
        </Button> : null}
      </div> : null}
    </div>);
  }
}

export default DelegateListV2;
