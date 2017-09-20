import actionTypes from '../../constants/actions';
import votingConst from '../../constants/voting';
import { errorToastDisplayed } from '../../actions/toaster';

const votingMiddleware = store => next => (action) => {
  next(action);
  if (action.type === actionTypes.voteToggled) {
    const { votes } = store.getState().voting;
    const voteCount = Object.keys(votes).filter(
      key => votes[key].confirmed !== votes[key].unconfirmed).length;
    const currentVote = votes[action.data.username] || { unconfirmed: true, confirmed: false };
    console.log(voteCount, votingConst.maxCountOfVotesInOneTurn, currentVote);
    if (voteCount === votingConst.maxCountOfVotesInOneTurn + 1 &&
        currentVote.unconfirmed !== currentVote.confirmed) {
      const label = `Maximum of ${votingConst.maxCountOfVotesInOneTurn} votes in one transaction exceeded.`;
      const newAction = errorToastDisplayed({ label });
      store.dispatch(newAction);
    }
  }
};

export default votingMiddleware;

