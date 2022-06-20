import React from 'react';
import { mount } from 'enzyme';
import { truncateAddress } from '@wallet/utils/account';
import DelegateVotesView from './delegateVotesView';

describe('Delegate votes view', () => {
  const loadData = jest.fn();
  const props = {
    t: v => v,
    voters: {
      loadData,
      meta: { count: 5, offset: 0, total: 10 },
      data: {
        votes: [
          {
            address: 'lskc7ofju4nvnshg6349otmcssme9q87wrpf8umws',
            amount: '3000000000',
          },
          {
            address: 'lskc7yrx3v76jxowgkgthu9yaf3dr29wqxbtxz8yp',
            amount: '1000000000',
            username: 'zero',
          },
          {
            address: 'lsk57pw74fg4tgx2uzjdja4vxbmouvzw5vbz3bvyo',
            amount: '20000000000',
            username: 'o_',
          },
          {
            address: 'lskajfb4mystpab9t87n5z8hprvbj6efzpr57rsky',
            amount: '300000000000',
            username: 'k3',
          },
          {
            address: 'lsk6nqfyzpof3xbn8gyvq3k3meusp6d43udgcc6y7',
            amount: '18000000000000',
            username: 'korben3',
          },
        ],
      },
    },
  };

  it('Should render a list of voters', () => {
    const wrapper = mount(<DelegateVotesView {...props} />);

    expect(wrapper.find('.totalVotes')).toHaveText(`(${props.voters.meta.total})`);
    expect(wrapper.find('.voteRow').hostNodes().length).toEqual(5);
    expect(wrapper.find('.voteRow').hostNodes().at(0)).toHaveText(truncateAddress('lskc7ofju4nvnshg6349otmcssme9q87wrpf8umws'));
    expect(wrapper.find('.voteRow').hostNodes().at(1)).toHaveText('zero');
    expect(wrapper.find('.voteRow').hostNodes().at(2)).toHaveText('o_');
    expect(wrapper.find('.voteRow').hostNodes().at(3)).toHaveText('k3');
    expect(wrapper.find('.voteRow').hostNodes().at(4)).toHaveText('korben3');
  });

  it('Should call loadData', () => {
    const wrapper = mount(<DelegateVotesView {...props} />);

    wrapper.find('.load-more').at(0).simulate('click');
    expect(loadData).toHaveBeenCalledWith({ aggregate: true, offset: 5 });
  });

  it('Should filter voters', () => {
    const wrapper = mount(<DelegateVotesView {...props} />);

    wrapper.find('input.filter-by-address').simulate('change', {
      target: {
        value: 'zero',
      },
    });
    wrapper.update();

    expect(wrapper.find('.totalVotes')).toHaveText(`(${props.voters.meta.total})`);
    expect(wrapper.find('.voteRow').hostNodes().length).toEqual(1);
    expect(wrapper.find('.voteRow').hostNodes().at(0)).toHaveText('zero');
    expect(wrapper.find('.voteRow').hostNodes().at(1).exists()).toBeFalsy();

    wrapper.find('input.filter-by-address').simulate('change', {
      target: {
        value: 'lskc7',
      },
    });
    wrapper.update();

    expect(wrapper.find('.voteRow').hostNodes().length).toEqual(2);
    expect(wrapper.find('.voteRow').hostNodes().at(0)).toHaveText(truncateAddress('lskc7ofju4nvnshg6349otmcssme9q87wrpf8umws'));
    expect(wrapper.find('.voteRow').hostNodes().at(1)).toHaveText('zero');
    expect(wrapper.find('.voteRow').hostNodes().at(2).exists()).toBeFalsy();
  });
});
