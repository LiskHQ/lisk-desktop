import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { errorToastDisplayed } from '../../actions/toaster';
import middleware from './voting';
import actionTypes from '../../constants/actions';
import votingConst from '../../constants/voting';

describe('voting middleware', () => {
  let store;
  let next;
  const label = `Maximum of ${votingConst.maxCountOfVotesInOneTurn} votes in one transaction exceeded.`;

  const generateNVotes = n => (
    [...Array(n)].map((item, i) => i).reduce(
      (dict, value) => {
        dict[`genesis_${value}`] = { confirmed: false, unconfirmed: true };
        return dict;
      }, {})
  );

  beforeEach(() => {
    store = stub();
    store.getState = () => ({
      voting: {
        votes: {
          ...generateNVotes(votingConst.maxCountOfVotesInOneTurn + 1),
          test2: {
            unconfirmed: false,
            confirmed: false,
          },
        },
      },
    });
    store.dispatch = spy();
    next = spy();
  });

  it('should passes the action to next middleware', () => {
    const givenAction = {
      type: 'TEST_ACTION',
    };

    middleware(store)(next)(givenAction);
    expect(next).to.have.been.calledWith(givenAction);
  });

  it('should dispatch errorToastDisplayed if 34 new votes and new vote unconfirmed !== confirmed ', () => {
    const givenAction = {
      type: actionTypes.voteToggled,
      data: {
        username: 'test',
      },
    };
    middleware(store)(next)(givenAction);
    expect(store.dispatch).to.have.been.calledWith(errorToastDisplayed({ label }));
  });

  it('should not dispatch errorToastDisplayed if 34 new votes and new vote unconfirmed === confirmed ', () => {
    const givenAction = {
      type: actionTypes.voteToggled,
      data: {
        username: 'test2',
      },
    };
    middleware(store)(next)(givenAction);
    expect(store.dispatch).to.not.have.been.calledWith(errorToastDisplayed({ label }));
  });
});
