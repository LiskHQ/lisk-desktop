import mockPinnedApplications, { applicationsMap } from '@tests/fixtures/blockchainApplications';
import { selectPinnedApplications, selectApplications } from './selectors';

describe('Application Explorer selector', () => {
  it('Should return list of pinned applications if action type is triggered', async () => {
    const state = { blockChainApplications: { pins: mockPinnedApplications } };
    expect(selectPinnedApplications(state)).toEqual(mockPinnedApplications);
  });

  it('Should return list of all applications if action type is triggered', async () => {
    const state = { blockChainApplications: { applications: applicationsMap } };
    expect(selectApplications(state)).toEqual(applicationsMap);
  });
});
