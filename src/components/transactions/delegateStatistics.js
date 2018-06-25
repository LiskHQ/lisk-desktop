import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import UserVotes from './userVotes';
import VotedDelegates from './votedDelegates';
import styles from './delegateStatistics.css';

class DelegateStatistics extends React.Component {
  render() {
    const { delegate } = this.props;

    let status = '';
    if (delegate && delegate.rank) {
      status = delegate.rank <= 101 ? this.props.t('Active') : this.props.t('Standby');
    }

    const missed = this.props.t('missed');
    return (
      <div className={`${styles.details} delegate-statistics`}>
        <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} productivity`}>
            <div className={styles.label}>{this.props.t('Uptime')}</div>
            <div className={styles.value}>{delegate && delegate.productivity}%</div>
          </div>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} rank`}>
            <div className={styles.label}>{this.props.t('Rank / Status')}</div>
            <div className={styles.value}>{delegate && delegate.rank} / {status}</div>
          </div>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} approval`}>
            <div className={styles.label}>{this.props.t('Approval')}</div>
            <div className={styles.value}>{delegate && delegate.approval}%</div>
          </div>
        </div>
        <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row} vote`}>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']}`}>
            <div className={styles.label}>{this.props.t('Vote weight')}</div>
            <div className={styles.value}>{delegate && delegate.vote}</div>
          </div>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-8']} ${grid['col-md-8']} blocks`}>
            <div className={styles.label}>{this.props.t('Blocks')}</div>
            <div className={styles.value}>
              {`${delegate && delegate.producedblocks} (${delegate && delegate.missedblocks} ${missed})`}
            </div>
          </div>
        </div>
        <UserVotes {...this.props} />
        <VotedDelegates {...this.props} />
      </div>
    );
  }
}

export default translate()(DelegateStatistics);

