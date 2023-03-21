import mockPinnedApplications from '@tests/fixtures/blockchainApplicationsExplore';
import mockApplications, { applicationsMap } from '@tests/fixtures/blockchainApplicationsManage';
import {
  selectPinnedApplications,
  selectApplications,
  selectCurrentApplication,
  selectCurrentApplicationChainId,
} from './selectors';

describe('Application Explorer selector', () => {
  it('Should return list of pinned applications if action type is triggered', async () => {
    const state = { blockChainApplications: { pins: mockPinnedApplications } };
    expect(selectPinnedApplications(state)).toEqual(mockPinnedApplications);
  });

  it('Should return list of all applications if action type is triggered', async () => {
    const state = { blockChainApplications: { applications: applicationsMap } };
    expect(selectApplications(state)).toEqual(applicationsMap);
  });
  it('Should return current application if setCurrentApplication action type is triggered', async () => {
    const state = { blockChainApplications: { current: mockApplications[0] } };
    expect(selectCurrentApplication(state)).toEqual(mockApplications[0]);
  });
  it('Should return current application chainID', async () => {
    const state = { blockChainApplications: { current: mockApplications[0] } };
    expect(selectCurrentApplicationChainId(state)).toEqual(mockApplications[0].chainID);
  });
});
