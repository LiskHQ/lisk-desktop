import React from 'react';
import { MemoryRouter } from 'react-router';
import { mountWithContext } from '@tests/unit-test-utils/mountHelpers';
import { addedToWatchList, removedFromWatchList } from 'src/redux/actions';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import usePosToken from '@pos/validator/hooks/usePosToken';
import ValidatorRow from './ValidatorRow';
import { usePosConstants } from '../../hooks/queries';
import { mockPosConstants } from '../../__fixtures__/mockPosConstants';

jest.mock('src/redux/actions');
jest.mock('@pos/validator/hooks/usePosToken');
jest.mock('../../hooks/queries/usePosConstants');

let wrapper;
const props = {
  data: {
    address: 'lskbgyrx3v76jxowgkgthu9yaf3dr29wqxbtxz8yp',
    username: 'test_del_2',
  },
  className: '',
  t: (str) => str,
  activeTab: 'active',
  watchList: [],
  setActiveTab: jest.fn(),
  blocks: {
    generators: [
      {
        address: 'lskbgyrx3v76jxowgkgthu9yaf3dr29wqxbtxz8yp',
        isConsensusParticipant: true,
        minActiveHeight: 14075261,
        nextGeneratingTime: 1654135710,
        rank: 22,
        state: 'awaitingSlot',
        totalStakeReceived: '10828000000000',
        username: 'test_del_2',
      },
    ],
    indexBook: { lskbgyrx3v76jxowgkgthu9yaf3dr29wqxbtxz8yp: 0 },
  },
};

usePosToken.mockReturnValue({ token: mockAppsTokens.data[0] });
usePosConstants.mockReturnValue({ data: mockPosConstants });

describe('ValidatorRow', () => {
  it('adds validators to watch list when watch icon is clicked', () => {
    wrapper = mountWithContext(
      <MemoryRouter>
        <ValidatorRow {...props} />
      </MemoryRouter>,
      { storeState: {} }
    );
    wrapper.find('.watch-icon').simulate('click');
    expect(addedToWatchList).toHaveBeenCalledWith({ address: props.data.address });
  });

  it('removes validator from watched list when watch icon is clicked', () => {
    const updatedProps = {
      ...props,
      activeTab: 'watched',
      watchList: ['lskbgyrx3v76jxowgkgthu9yaf3dr29wqxbtxz8yp'],
    };
    wrapper = mountWithContext(
      <MemoryRouter>
        <ValidatorRow {...updatedProps} />
      </MemoryRouter>,
      { storeState: {} }
    );
    wrapper.find('.watch-icon').simulate('click');
    expect(removedFromWatchList).toHaveBeenCalledWith({ address: props.data.address });
  });

  it('displays default layout if active tab is invalid', () => {
    const updatedProps = { ...props, activeTab: 'invalidTab' };
    wrapper = mountWithContext(
      <MemoryRouter>
        <ValidatorRow {...updatedProps} />
      </MemoryRouter>,
      { storeState: {} }
    );
    expect(wrapper.find('.watch-icon')).toExist();
  });
});
