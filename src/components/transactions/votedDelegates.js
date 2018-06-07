import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import { FontIcon } from '../fontIcon';
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
              {this.props.t('Who voted for a delegate')}
              {` (${this.state.votersSize})`}
            </div>
            {super.renderSearchFilter('votersFilterQuery', t('Filter voters'))}
          </div>
          <div className={styles.value}>
            {voters && voters
              .slice(0, this.state.showVotersNumber)}
          </div>
          {voters.length > this.state.showVotersNumber ?
            <div onClick={() => { super.showMore('showVotersNumber'); }} className={`${styles.showMore} showMore  show-voters`}>
              <FontIcon className={styles.arrowDown} value='arrow-down'/>
              {this.props.t('Show more')}
            </div> : ''
          }
        </div>
      </div>
    );
  }
}

export default translate()(VotedDelegates);

