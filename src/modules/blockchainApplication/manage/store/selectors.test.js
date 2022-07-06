import mockPinnedApplications from '@tests/fixtures/blockchainApplicationsExplore';
import mockApplications from '@tests/fixtures/blockchainApplicationsManage';
import { selectPinnedApplications, selectCurrentApplication } from './selectors';

describe('Application Explorer selector', () => {
  it('Should return list of pinned applications action type is tiggered', async () => {
    const state = { blockChainApplications: { pins: mockPinnedApplications } };
    expect(selectPinnedApplications(state)).toEqual(mockPinnedApplications);
  });

  it('Should return current application if setCurrentApplication action type is tiggered', async () => {
    const state = { blockChainApplications: { current: mockApplications[0] } };
    expect(selectCurrentApplication(state)).toEqual(mockApplications[0]);
  });
});
