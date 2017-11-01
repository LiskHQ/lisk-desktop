import { expect } from 'chai';
import sinon from 'sinon';
import actionTypes from '../constants/actions';
import { forgedBlocksUpdated, forgingStatsUpdated,
  fetchAndUpdateForgedBlocks, fetchAndUpdateForgedStats } from './forging';
import * as forgingApi from '../utils/api/forging';
import { errorAlertDialogDisplayed } from './dialog';

describe('actions', () => {
  describe('forgedBlocksUpdated', () => {
    it('should create an action to update forged blocks', () => {
      const data = {
        online: true,
      };

      const expectedAction = {
        data,
        type: actionTypes.forgedBlocksUpdated,
      };
      expect(forgedBlocksUpdated(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('forgingStatsUpdated', () => {
    it('should create an action to update forging stats', () => {
      const data = { last7d: 1000 };

      const expectedAction = {
        data,
        type: actionTypes.forgingStatsUpdated,
      };
      expect(forgingStatsUpdated(data)).to.be.deep.equal(expectedAction);
    });
  });


  describe('fetchAndUpdateForgedBlocks', () => {
    let forgingApiMock;
    const data = {
      activePeer: {},
      limit: 20,
      offset: 0,
      generatorPublicKey: 'test_public-key',
    };
    const actionFunction = fetchAndUpdateForgedBlocks(data);
    let dispatch;

    beforeEach(() => {
      forgingApiMock = sinon.stub(forgingApi, 'getForgedBlocks');
      dispatch = sinon.spy();
    });

    afterEach(() => {
      forgingApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch forgedBlocksUpdated action if resolved', () => {
      forgingApiMock.returnsPromise().resolves({ blocks: 'value' });

      actionFunction(dispatch);
      expect(dispatch).to.have.been.calledWith(forgedBlocksUpdated('value'));
    });

    it('should dispatch errorAlertDialogDisplayed action if caught', () => {
      forgingApiMock.returnsPromise().rejects({ message: 'sample message' });

      actionFunction(dispatch);
      const expectedAction = errorAlertDialogDisplayed({ text: 'sample message' });
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });
  });

  describe('fetchAndUpdateForgedStats', () => {
    const key = 'sample_key';
    let forgingApiMock;
    const data = {
      activePeer: {},
      key,
      startMoment: 0,
      generatorPublicKey: 'test_public-key',
    };
    const actionFunction = fetchAndUpdateForgedStats(data);
    let dispatch;

    beforeEach(() => {
      forgingApiMock = sinon.stub(forgingApi, 'getForgedStats');
      dispatch = sinon.spy();
    });

    afterEach(() => {
      forgingApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch forgingStatsUpdated action if resolved', () => {
      forgingApiMock.returnsPromise().resolves({ forged: 'value' });

      actionFunction(dispatch);
      expect(dispatch).to.have.been.calledWith(forgingStatsUpdated({ [key]: 'value' }));
    });

    it('should dispatch errorAlertDialogDisplayed action if caught', () => {
      forgingApiMock.returnsPromise().rejects({ message: 'sample message' });

      actionFunction(dispatch);
      const expectedAction = errorAlertDialogDisplayed({ text: 'sample message' });
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });
  });
});
