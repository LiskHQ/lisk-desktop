import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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

import styles from './header.css';

function shouldShowRegisterDelegateButton(account) {
  return account.address
    && !account.delegate
    && account.loginType === loginType.normal
    && !Object.keys(account.hwInfo).length;
}

// This is equal to the header margin top
let headerTopEdge = 15;
let isAboveHeader = false;
let scrollContainer = null;

// eslint-disable-next-line max-statements
const VotingHeader = ({
  t,
  votes,
  onBoardingDiscarded,
  toggleVotingMode,
  votingModeEnabled,
}) => {
  const account = useSelector(state => state.account);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  // eslint-disable-next-line prefer-const
  let wrapper = React.createRef();
  const locateHeader = () => {
    isAboveHeader = scrollContainer.scrollTop >= headerTopEdge;
    if (isAboveHeader && !isHeaderSticky) {
      setIsHeaderSticky(true);
    } else if (!isAboveHeader && isHeaderSticky) {
      setIsHeaderSticky(false);
    }
  };

  useEffect(() => {
    scrollContainer = document.querySelector('.scrollContainer');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', locateHeader);
    }

    // Didn't bind it to state, since there's not need to re-render
    // THe fixed amount is related to the design specifications
    setTimeout(() => {
      headerTopEdge = wrapper.getBoundingClientRect().y - 58;
    }, 1);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', locateHeader);
      }
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      headerTopEdge = wrapper.getBoundingClientRect().y - 58;
    }, 1);
  }, [onBoardingDiscarded]);


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
      ref={wrapper}
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
              { shouldShowRegisterDelegateButton(account)
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
};

VotingHeader.defaultProps = {
  account: {},
  votes: {},
};

export default VotingHeader;
