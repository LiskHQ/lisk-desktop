import React from 'react';
import { MemoryRouter } from 'react-router';
import { mountWithContext } from '@tests/unit-test-utils/mountHelpers';
import { addedToWatchList, removedFromWatchList } from 'src/redux/actions';
import ValidatorRow from './ValidatorRow';

jest.mock('src/redux/actions');

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
    forgers: [
      {
        address: 'lskbgyrx3v76jxowgkgthu9yaf3dr29wqxbtxz8yp',
        isConsensusParticipant: true,
        minActiveHeight: 14075261,
        nextForgingTime: 1654135710,
        rank: 22,
        state: 'awaitingSlot',
        totalVotesReceived: '10828000000000',
        username: 'test_del_2',
      },
    ],
    indexBook: { lskbgyrx3v76jxowgkgthu9yaf3dr29wqxbtxz8yp: 0 },
  },
};

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

  it('removes delegate from watched list when watch icon is clicked', () => {
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
