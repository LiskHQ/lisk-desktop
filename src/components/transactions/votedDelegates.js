import React from 'react';
import Waypoint from 'react-waypoint';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import { FontIcon } from '../fontIcon';
import AccountList from './accountList';
import Piwik from '../../utils/piwik';
import styles from './delegateStatistics.css';

class VotedDelegates extends AccountList {
  onShowMore() {
    Piwik.trackingEvent('VotedDelegates', 'button', 'onShowMore');
    super.showMore('showVotersNumber');
  }

  render() {
    const voters = super.getFormatedDelegates('voters', 'votersFilterQuery');

    return (
      <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row} voters`}>
        <div className={`${grid['col-xs-12']} ${grid['col-sm-12']} ${grid['col-md-12']}`}>
          <div className={styles.label}>
            <div className='voters-value'>
              {this.props.t('Who voted for this delegate')}
              {` (${this.props.votersSize || 0})`}
            </div>
          </div>
          <div className={styles.value}>
            {voters && voters
                .slice(0, this.state.showMoreVoters ?
                  this.state.showVotersNumber : this.props.votersSize)}
          </div>
          {voters.length > this.state.showVotersNumber &&
           this.state.showMoreVoters ?
            <div onClick={() => this.onShowMore.bind(this)} className={`${styles.showMore} showMore  show-voters`}>
              <FontIcon className={styles.arrowDown} value='arrow-down'/>
              {this.props.t('Show more')}
            </div> :
            <Waypoint
              key={voters.length}
              onEnter={() => {
                if (voters.length < this.props.votersSize) {
                  super.searchMoreVoters();
                }
              }}>
            </Waypoint>
          }
        </div>
      </div>
    );
  }
}

export default translate()(VotedDelegates);

