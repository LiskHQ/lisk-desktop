import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { SecondaryButtonV2, PrimaryButtonV2 } from '../toolbox/buttons/button';
import Tooltip from '../toolbox/tooltip/tooltip';
import routes from './../../constants/routes';
import votingConst from '../../constants/voting';
import {
  getTotalVotesCount,
  getVoteList,
  getUnvoteList,
} from './../../utils/voting';

class VotingHeader extends React.Component {
  render() {
    const {
      t,
      votes,
      toggleVotingMode,
      votingModeEnabled,
    } = this.props;
    const voteList = getVoteList(votes);
    const unvoteList = getUnvoteList(votes);
    const {
      maxCountOfVotesInOneTurn,
      maxCountOfVotes,
      fee,
    } = votingConst;
    const totalActions = Math.ceil((
      voteList.length + unvoteList.length
    ) / maxCountOfVotesInOneTurn);
    return (
      <div className={`${grid.row} ${grid['between-xs']}`}>
        <div className={`${grid['col-sm-12']} ${grid['col-md-12']} `}>
          <div className={`${grid.row} ${grid['between-xs']}`}>
            <span>
              <span>
                <h2>{getTotalVotesCount(votes)}/{maxCountOfVotes}</h2>
                <div>{t('My votes after confirmation')}</div>
              </span>
              { votingModeEnabled ?
              <span>
               <h3>{voteList.length}</h3>
               <span>{t('Added votes')}</span>
              </span> :
              null }
              { unvoteList.length ?
              <span>
               <h3>{unvoteList.length}</h3>
               <span>{t('Remove votes')}</span>
              </span> :
              null }
              { votingModeEnabled ?
              <span>
               <h3>{totalActions}
                 <Tooltip>
                  <p>{t('Each time you add or remove a vote it is counted as an action. There\'s {{fee}} LSK fee per every 33 actions.', { fee })}</p>
                 </Tooltip>
               </h3>
               <span>{t('Total actions (Total fee:')}<b>{fee * totalActions} LSK</b>)</span>
              </span> :
              null }
            </span>
            { votingModeEnabled ?
            <span>
              <SecondaryButtonV2 onClick={toggleVotingMode}>
                {t('Cancel voting')}
              </SecondaryButtonV2>
              <PrimaryButtonV2>
                {t('Go to Confirmation')}
              </PrimaryButtonV2>
            </span> :
            <span>
              <Link to={routes.registerDelegate.path} >
                <SecondaryButtonV2 className='register-delegate'>
                  {t('Register as a Delegate')}
                </SecondaryButtonV2>
              </Link>
              <PrimaryButtonV2 onClick={toggleVotingMode}>
                {t('Start voting')}
              </PrimaryButtonV2>
            </span>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default VotingHeader;
