import { expect } from 'chai';
import { mock } from 'sinon';
import * as peers from './peers';
import { getNethash } from './nethash';


describe('Utils: Nethash', () => {
  let peersMock;
  const activePeer = {};

  beforeEach(() => {
    peersMock = mock(peers);
  });

  afterEach(() => {
    peersMock.restore();
  });

  it('should return the result from requestToActivePeer call', () => {
    const mockedReturns = 'requestToActivePeer returns something';

    peersMock.expects('requestToActivePeer')
      .withArgs(activePeer, 'blocks/getNethash')
      .returns(mockedReturns);

    const returnedPromise = getNethash(activePeer);
    expect(returnedPromise).to.equal(mockedReturns);
  });
});
