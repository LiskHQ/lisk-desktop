import mockPinnedApplications from '@tests/fixtures/blockchainApplications';
import { selectPinnedApplications } from './selectors';

describe('Application Explorer selector', () => {
  it('Should return list of pinned applications action type is tiggered', async () => {
    const state = { blockChainApplications: { pins: mockPinnedApplications } };
    expect(selectPinnedApplications(state)).toEqual(mockPinnedApplications);
  });
});
