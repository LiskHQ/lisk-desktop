import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import { FontIcon } from '../fontIcon';
import AccountList from './accountList';

import styles from './delegateStatistics.css';

class UserVotes extends AccountList {
  render() {
    const { t } = this.props;
    const votes = super.getFormatedDelegates('votes', 'votesFilterQuery');

    return (
      <div className={`${styles.details} user-votes`}>
        <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row} votes`}>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-12']} ${grid['col-md-12']}`}>
            <div className={styles.label}>
              <div className='votes-value'>
                {this.props.t('Votes of this account')}
                {` (${this.state.votesSize})`}
              </div>
              {super.renderSearchFilter('votesFilterQuery', t('Filter votes'))}
            </div>
            <div className={styles.value}>
              {votes && votes
                .slice(0, this.state.showVotesNumber)}
            </div>
            {votes.length > this.state.showVotesNumber
              && this.state.votesFilterQuery === '' ?
              <div onClick={() => { super.showMore('showVotesNumber'); }} className={`${styles.showMore} showMore show-votes`}>
                <FontIcon className={styles.arrowDown} value='arrow-down'/>
                {this.props.t('Show more')}
              </div> : ''
            }
          </div>
        </div>
      </div>
    );
  }
}

export default translate()(UserVotes);

