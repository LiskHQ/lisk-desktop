import { expect } from 'chai';
import actionTypes from '../constants/actions';
import { activePeerSet, activePeerReset } from './peers';

describe('actions', () => {
  it('should create an action to set the active peer', () => {
    const data = {
      currentPeer: 'localhost',
      port: 4000,
      randomPeer: false,
      testnet: true,
    };

    const expectedAction = {
      data,
      type: actionTypes.activePeerSet,
    };
    expect(activePeerSet(data)).to.be.deep.equal(expectedAction);
  });

  it('should create an action to reset the active peer', () => {
    const expectedAction = {
      type: actionTypes.activePeerReset,
    };
    expect(activePeerReset()).to.be.deep.equal(expectedAction);
  });
});
