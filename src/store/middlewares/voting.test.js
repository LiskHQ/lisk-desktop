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
  const label2 = `Maximum of ${votingConst.maxCountOfVotes} votes exceeded.`;

  const generateNVotes = (n, vote) => (
    [...Array(n)].map((item, i) => i).reduce(
      (dict, value) => {
        dict[`genesis_${value}`] = vote;
        return dict;
      }, {})
  );

  const initStoreWithNVotes = (n, vote) => {
    store.getState = () => ({
      voting: {
        votes: {
          ...generateNVotes(n, vote),
          test2: {
            unconfirmed: false,
            confirmed: false,
          },
        },
      },
    });
  };

  beforeEach(() => {
    store = stub();
    initStoreWithNVotes(
      votingConst.maxCountOfVotesInOneTurn + 1,
      { confirmed: false, unconfirmed: true });
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

  it('should dispatch errorToastDisplayed if 102 votes and new vote unconfirmed !== confirmed ', () => {
    initStoreWithNVotes(
      votingConst.maxCountOfVotes + 1,
      { confirmed: true, unconfirmed: true });
    const givenAction = {
      type: actionTypes.voteToggled,
      data: {
        username: 'test',
      },
    };
    middleware(store)(next)(givenAction);
    expect(store.dispatch).to.have.been.calledWith(errorToastDisplayed({ label: label2 }));
  });

  it('should not dispatch errorToastDisplayed if 102 votes and new vote unconfirmed === confirmed ', () => {
    initStoreWithNVotes(
      votingConst.maxCountOfVotes + 1,
      { confirmed: true, unconfirmed: true });
    const givenAction = {
      type: actionTypes.voteToggled,
      data: {
        username: 'genesis_42',
      },
    };
    middleware(store)(next)(givenAction);
    expect(store.dispatch).to.not.have.been.calledWith(errorToastDisplayed({ label: label2 }));
  });
});
