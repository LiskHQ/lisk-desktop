import { expect } from 'chai';
import { mock } from 'sinon';
import { requestToActivePeer } from './peers';


describe('Utils: Peers', () => {
  describe('requestToActivePeer', () => {
    let activePeerMock;
    const path = '/test/';
    const urlParams = {};
    const activePeer = {
      sendRequest: () => { },
    };

    beforeEach(() => {
      activePeerMock = mock(activePeer);
    });

    afterEach(() => {
      activePeerMock.restore();
    });

    it('should return a promise that is resolved when activePeer.sendRequest() calls its callback with data.success == true', () => {
      const response = {
        success: true,
        data: [],
      };
      activePeerMock.expects('sendRequest').withArgs(path, urlParams).callsArgWith(2, response);
      const requestPromise = requestToActivePeer(activePeer, path, urlParams);
      expect(requestPromise).to.eventually.deep.equal(response);
    });

    it('should return a promise that is resolved when activePeer.sendRequest() calls its callback with data.success == true', () => {
      const response = {
        success: false,
        message: 'some error message',
      };
      activePeerMock.expects('sendRequest').withArgs(path, urlParams).callsArgWith(2, response);
      const requestPromise = requestToActivePeer(activePeer, path, urlParams);
      expect(requestPromise).to.be.rejectedWith(response);
    });
  });
});
