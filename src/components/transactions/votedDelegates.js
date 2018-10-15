import React from 'react';
import Waypoint from 'react-waypoint';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import AccountList from './accountList';

import styles from './delegateStatistics.css';

class VotedDelegates extends AccountList {
  render() {
    const { t } = this.props;
    const voters = super.getFormatedDelegates('voters', 'votersFilterQuery');

    return (
      <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row} voters`}>
        <div className={`${grid['col-xs-12']} ${grid['col-sm-12']} ${grid['col-md-12']}`}>
          <div className={styles.label}>
            <div className='voters-value'>
              {this.props.t('Who voted for this delegate')}
              {` (${this.props.votersSize || 0})`}
            </div>
            {super.renderSearchFilter('votersFilterQuery', t('Filter voters'))}
          </div>
          <div className={styles.value}>
            { voters }
          </div>
          <Waypoint
            key={voters.length}
            onEnter={() => {
              if (voters.length < this.props.votersSize) {
                super.searchMoreVoters();
              }
            }}>
          </Waypoint>
        </div>
      </div>
    );
  }
}

export default translate()(VotedDelegates);

