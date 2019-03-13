import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import BoxV2 from '../boxV2';
import AccountVisual from '../accountVisual';
import VotesTableHeader from './votesTableHeader';
import TableRow from '../toolbox/table/tableRow';
import SpinnerV2 from '../spinnerV2/spinnerV2';
import styles from './votesTab.css';

class VotesTab extends React.Component {
  constructor() {
    super();

    this.state = {
      showing: 30,
    };

    this.onShowMore = this.onShowMore.bind(this);
  }

  onShowMore() {
    const max = this.props.votes.length;
    const showing = (this.state.showing + 30 > max) ? max : this.state.showing + 30;
    this.setState({ showing });
  }

  render() {
    const { t, votes, loading } = this.props;
    const canLoadMore = votes && votes.length > this.state.showing;
    const isLoading = loading.length > 0;

    return (
      <BoxV2 className={`${styles.wrapper}`}>
        <header>
        <h1>{t('Voted delegates')}</h1>
        </header>
        <main className={`${styles.results} ${canLoadMore ? styles.hasMore : ''} ${isLoading ? styles.isLoading : ''}`}>
          <VotesTableHeader />
          {
            isLoading ? (
              <div className={styles.loadingOverlay}>
                <SpinnerV2 className={`${styles.loadingSpinner}`} />
              </div>
            ) : null
          }
          {votes && votes.length > 0
            ? votes.slice(0, this.state.showing).map((vote, key) => (
              <TableRow key={`row-${key}`}>
                <div className={`${grid['col-sm-1']} ${grid['col-lg-1']}`}>

                </div>
                <div className={`${grid['col-sm-3']} ${grid['col-lg-6']}`}>
                  <div className={`${styles.info}`}>
                    <AccountVisual
                      className={`${styles.avatar}`}
                      address={vote.address}
                      size={36} />
                    <div className={styles.accountInfo}>
                      <span className={`${styles.title}`}>{vote.username}</span>
                      <span>{vote.address}</span>
                    </div>
                  </div>
                </div>
                <div className={`${grid['col-sm-3']} ${grid['col-lg-2']}`}>

                </div>
                <div className={`${grid['col-sm-2']} ${grid['col-lg-1']}`}>

                </div>
                <div className={`${grid['col-sm-3']} ${grid['col-lg-2']}`}>

                </div>
              </TableRow>
            )) : (
              <p className={`${styles.empty} empty-message`}>
                {t('This wallet doesn’t have any votes.')}
              </p>
            )}
          { canLoadMore && <span
            onClick={this.onShowMore}
            className={`${styles.showMore} show-more-button`}>{t('Show More')}</span>
          }
        </main>
      </BoxV2>
    );
  }
}

export default translate()(VotesTab);
