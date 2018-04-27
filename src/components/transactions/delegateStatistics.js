import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import Waypoint from 'react-waypoint';
import { connect } from 'react-redux';
import { accountVotersFetched, accountVotesFetched } from '../../actions/account';
import routes from './../../constants/routes';
import styles from './delegateStatistics.css';

class DelegateStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVotersNumber: 35,
      loadAll: {
        votes: false,
        voters: false,
      },
    };
  }

  loadMore() {
    this.setState({ showVotersNumber: this.state.showVotersNumber + 125 });
  }

  showAll(dataName) {
    this.setState({ loadAll: { ...this.state.loadAll, [dataName]: true } });
  }

  getInterspersed(dataName) {
    let data = this.props[dataName];
    // data = this.props[dataName] && !this.state.loadAll[dataName] ? data.slice(0, 35) : data;
    data = this.props[dataName] && this.state.loadAll[dataName] ? this.props[dataName] : data;
    data = data ? data.map((user, key) => (
      <Link className={`${styles.addressLink} ${styles.clickable} voter-address`}
        to={`${routes.explorer.path}${routes.accounts.path}/${user.address}`}
        key={`${key}-${dataName}`}>
        {`${user.username || user.address} `}
      </Link>
    )) : [];
    // putting <span>•</span> inbetween array objects
    const intersperse = data && data
      .reduce((arr, val) => [...arr, val, <span className={styles.dot} key={`span-${new Date().valueOf() * Math.random()}`}>• </span>], [])
      .slice(0, -1);
    return intersperse;
  }

  render() {
    const { delegate } = this.props;
    const votesInterspered = this.getInterspersed('votes');
    const votersInterspered = this.getInterspersed('voters');
    const missed = this.props.t('missed');
    return (
      <div className={`${styles.details}`}>
        <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']}`}>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']}`}>
            <div className={styles.label}>{this.props.t('Uptime')}</div>
            <div className={styles.value}>{delegate.productivity}%</div>
          </div>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']}`}>
            <div className={styles.label}>{this.props.t('Rank')}</div>
            <div className={styles.value}>{delegate.rank}</div>
          </div>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']}`}>
            <div className={styles.label}>{this.props.t('Approval')}</div>
            <div className={styles.value}>{delegate.approval}%</div>
          </div>
        </div>
        <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']}`}>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']}`}>
            <div className={styles.label}>{this.props.t('Vote weight')}</div>
            <div className={styles.value}>{delegate.vote}</div>
          </div>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-8']} ${grid['col-md-8']}`}>
            <div className={styles.label}>{this.props.t('Blocks')}</div>
            <div className={styles.value}>
              {`${delegate.producedblocks} (${delegate.missedblocks} ${missed})`}
            </div>
          </div>
        </div>
        <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']}`}>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-12']} ${grid['col-md-12']}`}>
            <div className={styles.label}>{this.props.t('Votes of this accont')}</div>
            <div className={styles.value}>{votesInterspered}</div>
            {!this.state.loadAll.votes ?
              <div onClick={() => { this.showAll('votes'); }}>Show All</div> : ''
            }
          </div>
        </div>
        <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']}`}>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-12']} ${grid['col-md-12']}`}>
            <div className={styles.label}>{this.props.t('Who voted to this delegate')}</div>
            <div className={styles.value}>
              {votersInterspered && votersInterspered.slice(0, this.state.showVotersNumber)}
            </div>
          </div>
        </div>
        <Waypoint
          bottomOffset='-60%'
          key='delegate-statistics'
          onEnter={() => {
            this.loadMore();
          }}></Waypoint>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  delegate: state.account.delegate || {},
  votes: state.account.votes || [],
  voters: state.account.voters || [],
  publicKey: state.account.delegate ? state.account.delegate.publicKey : null,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  accountVotersFetched: data => dispatch(accountVotersFetched(data)),
  accountVotesFetched: data => dispatch(accountVotesFetched(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(DelegateStatistics));

