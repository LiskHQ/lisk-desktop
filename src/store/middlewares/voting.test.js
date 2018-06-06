import { expect } from 'chai';
import { spy, stub, mock } from 'sinon';

import { voteLookupStatusUpdated } from '../../actions/voting';
import * as delegateApi from '../../utils/api/delegate';
import actionTypes from '../../constants/actions';
import middleware from './voting';
import votingConst from '../../constants/voting';

describe('voting middleware', () => {
  let store;
  let next;

  const generateNVotes = (n, vote) => (
    [...Array(n)].map((item, i) => i).reduce((dict, value) => {
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
      { confirmed: false, unconfirmed: true },
    );
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

  describe('on votesAdded action', () => {
    const state = {
      voting: {
        delegates: [
          {
            username: 'delegate_in_store',
            publicKey: 'some publicKey',
          },
        ],
        votes: {
          delegate_voted: {
            unconfirmed: true,
            confirmed: true,
          },
          delegate_unvoted: {
            unconfirmed: false,
            confirmed: false,
          },
        },
      },
      peers: {
        data: {},
      },
    };
    let getDelegateMock;

    beforeEach(() => {
      getDelegateMock = mock(delegateApi).expects('getDelegate').returnsPromise();
      store.getState = () => (state);
    });

    afterEach(() => {
      getDelegateMock.restore();
    });

    it('should do nothing if !action.upvotes or !action.dowvotes ', () => {
      const givenAction = {
        type: actionTypes.votesAdded,
        data: { },
      };
      middleware(store)(next)(givenAction);
      expect(store.dispatch).to.not.have.been.calledWith();
    });

    it('should dispatch voteLookupStatusUpdated with username from action.data.upvotes and status \'upvotes\'', () => {
      const username = 'delegate_unvoted';
      const status = 'upvotes';
      const givenAction = {
        type: actionTypes.votesAdded,
        data: {
          upvotes: [username],
          unvotes: [],
        },
      };

      middleware(store)(next)(givenAction);
      getDelegateMock.resolves({ delegate: { username, publicKey: 'whatever' } });

      expect(store.dispatch).to.have.been.calledWith(voteLookupStatusUpdated({ username, status }));
    });

    it('should dispatch voteLookupStatusUpdated with username from action.data.upvotes and status \'alreadyVoted\'', () => {
      const username = 'delegate_voted';
      const status = 'alreadyVoted';
      const givenAction = {
        type: actionTypes.votesAdded,
        data: {
          upvotes: [username],
          unvotes: [],
        },
      };

      middleware(store)(next)(givenAction);
      getDelegateMock.resolves({ delegate: { username, publicKey: 'whatever' } });

      expect(store.dispatch).to.have.been.calledWith(voteLookupStatusUpdated({ username, status }));
    });

    it('should dispatch voteLookupStatusUpdated with username from action.data.unvotes and status \'unvotes\'', () => {
      const username = 'delegate_voted';
      const status = 'unvotes';
      const givenAction = {
        type: actionTypes.votesAdded,
        data: {
          upvotes: [],
          unvotes: [username],
        },
      };

      middleware(store)(next)(givenAction);
      getDelegateMock.resolves({ delegate: { username, publicKey: 'whatever' } });

      expect(store.dispatch).to.have.been.calledWith(voteLookupStatusUpdated({ username, status }));
    });

    it('should dispatch voteLookupStatusUpdated with username from action.data.unvotes and status \'notVotedYet\'', () => {
      const username = 'delegate_unvoted';
      const status = 'notVotedYet';
      const givenAction = {
        type: actionTypes.votesAdded,
        data: {
          upvotes: [],
          unvotes: [username],
        },
      };

      middleware(store)(next)(givenAction);
      getDelegateMock.resolves({ delegate: { username, publicKey: 'whatever' } });

      expect(store.dispatch).to.have.been.calledWith(voteLookupStatusUpdated({ username, status }));
    });

    it('should dispatch voteLookupStatusUpdated with username from action.data.unvotes and status \'notFound\' if delegate not found', () => {
      const username = 'delegate_invalid';
      const status = 'notFound';
      const givenAction = {
        type: actionTypes.votesAdded,
        data: {
          upvotes: [],
          unvotes: [username],
        },
      };

      middleware(store)(next)(givenAction);
      getDelegateMock.rejects();

      expect(store.dispatch).to.have.been.calledWith(voteLookupStatusUpdated({ username, status }));
    });

    it('should not call getDelegate API if given delegate is in store', () => {
      const username = 'delegate_in_store';
      const givenAction = {
        type: actionTypes.votesAdded,
        data: {
          upvotes: [username],
          unvotes: [],
        },
      };

      middleware(store)(next)(givenAction);
      getDelegateMock.rejects();

      expect(getDelegateMock).to.not.have.been.calledWith();
    });
  });
});
