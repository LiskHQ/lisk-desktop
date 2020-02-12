import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { loginType } from '../../../constants/hwConstants';
import { SecondaryButton, PrimaryButton } from '../../toolbox/buttons/button';
import Tooltip from '../../toolbox/tooltip/tooltip';
import Icon from '../../toolbox/icon';
import SignInTooltipWrapper from '../../shared/signInTooltipWrapper';
import routes from '../../../constants/routes';
import votingConst from '../../../constants/voting';
import {
  getTotalVotesCount,
  getVoteList,
  getUnvoteList,
  getTotalActions,
} from '../../../utils/voting';

import styles from './votingHeader.css';

function shouldShowRegisterDelagteButton(account) {
  return account.address
    && !account.delegate
    && account.loginType === loginType.normal
    && !Object.keys(account.hwInfo).length;
}

class VotingHeader extends React.Component {
  state = {};

  // This is equal to the header margin top
  headerTopEdge = 15;

  componentDidMount() {
    this.scrollContainer = document.querySelector('.scrollContainer');
    if (this.scrollContainer) {
      this.scrollContainer.addEventListener('scroll', this.locateHeader);
    }

    // Didn't bind it to state, since there's not need to re-render
    // THe fixed amount is related to the design specifications
    setTimeout(() => {
      this.headerTopEdge = this.wrapper.getBoundingClientRect().y - 58;
    }, 1);
  }

  componentWillUnmount() {
    if (this.scrollContainer) {
      this.scrollContainer.removeEventListener('scroll', this.locateHeader);
    }
  }

  componentDidUpdate(newProps) {
    if (this.props.onBoardingDiscarded !== newProps.onBoardingDiscarded) {
      setTimeout(() => {
        this.headerTopEdge = this.wrapper.getBoundingClientRect().y - 58;
      }, 1);
    }
  }

  locateHeader = () => {
    this.isAboveHeader = this.scrollContainer.scrollTop >= this.headerTopEdge;
    if (this.isAboveHeader && !this.state.isHeaderSticky) {
      this.setState({ isHeaderSticky: true });
    } else if (!this.isAboveHeader && this.state.isHeaderSticky) {
      this.setState({ isHeaderSticky: false });
    }
  }

  render() {
    const {
      t,
      votes,
      toggleVotingMode,
      votingModeEnabled,
      account,
    } = this.props;
    const { isHeaderSticky } = this.state;
    const voteList = getVoteList(votes);
    const unvoteList = getUnvoteList(votes);
    const totalActions = getTotalActions(votes);
    const {
      maxCountOfVotes,
      fee,
    } = votingConst;
    return (
      <div
        className={`${styles.wrapper} voting-header ${isHeaderSticky ? `${styles.sticky} sticky` : ''}`}
        ref={(el) => { this.wrapper = el; }}
      >
        <div className={styles.bg} />
        <div className={styles.stickyContent}>
          <div className={styles.info}>
            { votingModeEnabled
              ? (
                <Fragment>
                  <div className={`${styles.infoItem} ${styles.total}`}>
                    <figure className={styles.icon}>
                      <Icon name="totalVotes" />
                    </figure>
                    <h5>
                      <span className="total-voting-number">{getTotalVotesCount(votes)}</span>
                      {`/${maxCountOfVotes}`}
                    </h5>
                    <span className={styles.subTitle}>{t('Total')}</span>
                  </div>
                  <div className={`${styles.infoItem} ${styles.addedVotes}`}>
                    <figure className={styles.icon}>
                      <Icon name="addedVotes" />
                    </figure>
                    <h5 className="added-votes-count">{voteList.length}</h5>
                    <span className={styles.subTitle}>{t('Added')}</span>
                  </div>
                </Fragment>
              )
              : (
                <Fragment>
                  <div className={`${styles.box} ${styles.signedOut}`}>
                    <h2>
                      {`${t('Delegates')}`}
                    </h2>
                    <span className={styles.subTitle}>{t('Vote for who secures the network or becomes a delegate.')}</span>
                  </div>
                </Fragment>
              )
            }
            { unvoteList.length
              ? (
                <div className={`${styles.infoItem} ${styles.removedVotes}`}>
                  <figure className={styles.icon}>
                    <Icon name="removedVotes" />
                  </figure>
                  <h5 className="removed-votes-count">{unvoteList.length}</h5>
                  <span className={styles.subTitle}>{t('Removed')}</span>
                </div>
              )
              : null
            }
            { votingModeEnabled
              ? (
                <div className={`${styles.infoItem} ${styles.fee}`}>
                  <figure className={styles.icon}>
                    <Icon name="walletIcon" />
                  </figure>
                  <h5>
                    <span>{`${totalActions} LSK`}</span>
                    <Tooltip className={`${styles.tooltip} showOnBottom`}>
                      <p>{t('Each time you add or remove a vote it is counted as an action. There\'s {{fee}} LSK fee per every 33 actions.', { fee })}</p>
                    </Tooltip>
                  </h5>
                  <span className={styles.subTitle}>{t('Transaction fee')}</span>
                </div>
              )
              : null
            }
          </div>
          { votingModeEnabled
            ? (
              <div className={styles.actionBar}>
                <SecondaryButton onClick={toggleVotingMode} className={`cancel-voting-button ${styles.btn}`}>
                  {t('Cancel')}
                </SecondaryButton>
                <Link to={totalActions !== 0 ? routes.voting.path : routes.delegates.path}>
                  <PrimaryButton className={`${styles.btn} go-to-confirmation-button`} disabled={totalActions === 0}>
                    {t('Confirm')}
                  </PrimaryButton>
                </Link>
              </div>
            )
            : (
              <div className={styles.actionBar}>
                { shouldShowRegisterDelagteButton(account)
                  ? (
                    <Link to={routes.registerDelegate.path}>
                      <SecondaryButton className={`register-delegate ${styles.btn}`}>
                        {t('Register as a Delegate')}
                      </SecondaryButton>
                    </Link>
                  )
                  : null
                }
                <SignInTooltipWrapper>
                  <PrimaryButton onClick={toggleVotingMode} className={`start-voting-button ${styles.btn}`}>
                    {Object.keys(votes).length ? t('Edit votes') : t('Start voting')}
                  </PrimaryButton>
                </SignInTooltipWrapper>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

VotingHeader.defaultProps = {
  account: {},
  votes: {},
};

export default VotingHeader;
