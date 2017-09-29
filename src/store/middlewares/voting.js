import i18next from 'i18next';
import { errorToastDisplayed } from '../../actions/toaster';
import actionTypes from '../../constants/actions';
import votingConst from '../../constants/voting';

const votingMiddleware = store => next => (action) => {
  next(action);
  if (action.type === actionTypes.voteToggled) {
    const { votes } = store.getState().voting;
    const currentVote = votes[action.data.username] || { unconfirmed: true, confirmed: false };

    const newVoteCount = Object.keys(votes).filter(
      key => votes[key].confirmed !== votes[key].unconfirmed).length;
    if (newVoteCount === votingConst.maxCountOfVotesInOneTurn + 1 &&
        currentVote.unconfirmed !== currentVote.confirmed) {
      const label = i18next.t('Maximum of {{n}} votes in one transaction exceeded.', { n: votingConst.maxCountOfVotesInOneTurn });
      const newAction = errorToastDisplayed({ label });
      store.dispatch(newAction);
    }

    const voteCount = Object.keys(votes).filter(
      key => (votes[key].confirmed && !votes[key].unconfirmed) || votes[key].unconfirmed).length;
    if (voteCount === votingConst.maxCountOfVotes + 1 &&
        currentVote.unconfirmed !== currentVote.confirmed) {
      const label = i18next.t('Maximum of {{n}} votes exceeded.', { n: votingConst.maxCountOfVotes });
      const newAction = errorToastDisplayed({ label });
      store.dispatch(newAction);
    }
  }
};

export default votingMiddleware;
