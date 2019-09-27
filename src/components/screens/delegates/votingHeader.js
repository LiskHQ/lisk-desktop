import React from 'react';
import { Link } from 'react-router-dom';
import { loginType } from '../../../constants/hwConstants';
import { SecondaryButton, PrimaryButton } from '../../toolbox/buttons/button';
import Tooltip from '../../toolbox/tooltip/tooltip';
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
  render() {
    const {
      t,
      votes,
      toggleVotingMode,
      votingModeEnabled,
      account,
    } = this.props;
    const voteList = getVoteList(votes);
    const unvoteList = getUnvoteList(votes);
    const totalActions = getTotalActions(votes);
    const {
      maxCountOfVotes,
      fee,
    } = votingConst;
    return (
      <div className={`${styles.wrapper} voting-header`}>
        <span>
          { account && account.address
            ? (
              <span className={styles.box}>
                <h2>
                  <span className="total-voting-number">{getTotalVotesCount(votes)}</span>
                  {`/${maxCountOfVotes}`}
                </h2>
                <div>{t('My votes after confirmation')}</div>
              </span>
            )
            : (
              <span className={styles.box}>
                <h2>
                  {' '}
                  {t('Delegates')}
                  {' '}
                </h2>
                <div>{t('All important information about delegates.')}</div>
              </span>
            )
              }
          { votingModeEnabled
            ? (
              <span className={`${styles.outlinedBox} ${styles.addedVotes}`}>
                <h3 className="added-votes-count">{voteList.length}</h3>
                <span>{t('Added votes')}</span>
              </span>
            )
            : null }
          { unvoteList.length
            ? (
              <span className={`${styles.outlinedBox} ${styles.removedVotes}`}>
                <h3 className="removed-votes-count">{unvoteList.length}</h3>
                <span>{t('Removed votes')}</span>
              </span>
            )
            : null }
          { votingModeEnabled
            ? (
              <span className={styles.outlinedBox}>
                <h3>
                  {totalActions}
                  <Tooltip className={styles.tooltip}>
                    <p>{t('Each time you add or remove a vote it is counted as an action. There\'s {{fee}} LSK fee per every 33 actions.', { fee })}</p>
                  </Tooltip>
                </h3>
                <span className={styles.hideInMedium}>{t('Total transactions (')}</span>
                <span>
                  {t('Total fee: ')}
                  <b>
                    {`${fee * totalActions} LSK`}
                  </b>
                </span>
                <span className={styles.hideInMedium}>)</span>
              </span>
            )
            : null }
        </span>
        { votingModeEnabled
          ? (
            <span>
              <SecondaryButton onClick={toggleVotingMode} className={`cancel-voting-button ${styles.btn}`}>
                {t('Cancel voting')}
              </SecondaryButton>
              <Link to={totalActions !== 0 ? routes.voting.path : routes.delegates.path}>
                <PrimaryButton className={`${styles.btn} go-to-confirmation-button`} disabled={totalActions === 0}>
                  {t('Go to confirmation')}
                </PrimaryButton>
              </Link>
            </span>
          )
          : (
            <span>
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
                  {t('Start voting')}
                </PrimaryButton>
              </SignInTooltipWrapper>
            </span>
          )
            }
      </div>
    );
  }
}

VotingHeader.defaultProps = {
  account: {},
  votes: {},
};

export default VotingHeader;
