import React from 'react';
import { mount } from 'enzyme';
import * as reactRedux from 'react-redux';
import configureStore from 'redux-mock-store';
import DelegateRow from './delegateRow';
import * as votingActions from '../../../../actions/voting';

const { Provider } = reactRedux;
const fakeStore = configureStore();
const voting = {
  votes: {
    rooney: {
      confirmed: true,
      unconfirmed: true,
      publicKey: 'b3953cb16e2457b9be78ad8c8a2985435dedaed5f0dd63443bdfbccc92d09f2d',
      address: '6356913781456505636L',
    },
  },
};
reactRedux.useSelector = jest.fn().mockImplementation(filter => filter({
  network: {
    networks: {
      LSK: { apiVersion: '2' },
    },
  },
  voting,
}));

describe('DelegateRow', () => {
  const props = {
    data: {
      username: 'rooney',
      vote: '6378303113984358',
      rewards: '37390000000000',
      producedBlocks: 97632,
      missedBlocks: 309,
      productivity: 99.68,
      rank: 1,
      account: {
        address: '6356913781456505636L',
        publicKey: 'b3953cb16e2457b9be78ad8c8a2985435dedaed5f0dd63443bdfbccc92d09f2d',
        secondPublicKey: '69c9c77e900320dae8efc1396b97206ba7bec409f9a83c765f62ac40f58768bd',
      },
      approval: 46.33,
    },
  };

  it('calls voteToggled when clicked on rows', () => {
    votingActions.voteToggled = jest.fn();
    const wrapper = mount(<DelegateRow
      {...{
        ...props,
        votingModeEnabled: true,
        shouldShowVoteColumn: true,
      }}
    />);
    wrapper.simulate('click');
    expect(votingActions.voteToggled).toHaveBeenCalled();
  });

  it('hides vote checkbox if shouldShowVoteColumn is false', () => {
    votingActions.voteToggled = jest.fn();
    const wrapper = mount(<DelegateRow
      {...{
        ...props,
        shouldShowVoteColumn: false,
      }}
    />);
    expect(wrapper.find('.checkbox-column').hasClass('hidden')).toEqual(true);
  });

  describe('Vote checkbox', () => {
    it('shows checkmark when votingModeEnabled is false', () => {
      const store = fakeStore({ voting });
      const wrapper = mount(
        <Provider store={store}>
          <DelegateRow
            {...{
              ...props,
              shouldShowVoteColumn: true,
              votingModeEnabled: false,
            }}
          />
        </Provider>,
      );
      expect(wrapper.find('Icon')).toHaveLength(1);
    });
    it('shows spinner if vote is pending', () => {
      voting.votes.rooney.pending = true;
      const store = fakeStore({ voting });
      const wrapper = mount(
        <Provider store={store}>
          <DelegateRow
            {...{
              ...props,
              shouldShowVoteColumn: true,
              votingModeEnabled: false,
            }}
          />
        </Provider>,
      );
      expect(wrapper.find('Spinner')).toHaveLength(1);
    });
  });
});
