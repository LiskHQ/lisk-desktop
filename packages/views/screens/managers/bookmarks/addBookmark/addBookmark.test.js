import React from 'react';
import { mount } from 'enzyme';
import * as bitcoin from 'bitcoinjs-lib';
import { tokenMap, tokenKeys } from '@common/configuration';
import accounts from '../../../../../test/constants/accounts';
import AddBookmark from './addBookmark';

describe('Add a new bookmark component', () => {
  const bookmarks = {
    LSK: [],
    BTC: [],
  };
  const props = {
    t: v => v,
    token: {
      active: tokenMap.LSK.key,
    },
    bookmarks,
    network: {
      name: 'testnet',
      networks: {
        BTC: {
          network: bitcoin.networks.testnet,
          serviceUrl: 'https://btc.lisk.com',
          minerFeesURL: 'https://bitcoinfees.earn.com/api/v1/fees/recommended',
          derivationPath: "m/44'/1'/0'/0/0",
        },
        LSK: {
          serviceUrl: 'https://service.lisk.com',
        },
      },
    },
    history: {
      push: jest.fn(),
      location: {
        search: `?address=${accounts.genesis.summary.address}L&modal=addBookmark&formAddress=${accounts.genesis.summary.address}&label=&isDelegate=false`,
      },
    },
    account: {
      data: {
        summary: {},
        dpos: {},
      },
      loadData: jest.fn(),
    },
    bookmarkAdded: jest.fn(),
    prevStep: jest.fn(),
  };
  const addresses = {
    BTC: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
    LSK: accounts.genesis.summary.address,
  };

  let wrapper;

  beforeEach(() => {
    wrapper = mount(<AddBookmark {...props} />);
  });

  afterEach(() => {
    props.history.push.mockClear();
    props.bookmarkAdded.mockClear();
    props.account.loadData.mockReset();
  });

  it('Should render properly and with pristine state', () => {
    expect(wrapper).not.toContainMatchingElement('.error');
    expect(wrapper).toContainMatchingElements(2, 'Input');
    expect(wrapper.find('button.save-button')).toBeDisabled();
  });

  describe('Success scenarios', () => {
    tokenKeys.forEach((token) => {
      it(`Should add ${token} account`, () => {
        wrapper.setProps({ token: { active: token } });
        wrapper.find('input[name="address"]').first().simulate('change', {
          target: {
            value: addresses[token],
            name: 'address',
          },
        });
        wrapper.find('input[name="label"]').at(0).simulate('change', {
          target: {
            value: `label-${token}`,
            name: 'label',
          },
        });
        expect(wrapper).not.toContainMatchingElement('.error');
        expect(wrapper.find('button').at(0)).not.toBeDisabled();
        wrapper.find('button.save-button').simulate('click');
        expect(props.bookmarkAdded).toBeCalled();
      });
    });

    it('should not be possible to change delegate label', () => {
      const accountAddress = accounts.delegate.summary.address;
      const accountUsername = accounts.delegate.dpos.delegate.username;
      wrapper.find('input[name="address"]').first().simulate('change', {
        target: {
          value: accountAddress,
          name: 'address',
        },
      });
      wrapper.setProps({
        account: { ...props.account, data: accounts.delegate },
        history: {
          push: jest.fn(),
          location: {
            search: `?address=${accountAddress}L&modal=addBookmark&formAddress=${accountAddress}&label=${accountUsername}&isDelegate=true`,
          },
        },
      });
      wrapper.update();
      expect(wrapper.find('input[name="label"]')).toHaveValue(accountUsername);
      expect(wrapper.find('input[name="label"]')).toHaveProp('readOnly', true);
      expect(wrapper.find('button').at(0)).not.toBeDisabled();
      wrapper.find('button').at(0).simulate('click');
    });
  });

  describe('Fail scenarios', () => {
    beforeEach(() => {
      wrapper.setProps({
        bookmarks: {
          LSK: [{ address: addresses.LSK, title: 'genesis' }],
          BTC: [{ address: addresses.BTC, title: 'btc' }],
        },
      });
    });

    tokenKeys.forEach((token) => {
      it(`should not be possible to add already bookmarked address - ${token}`, () => {
        wrapper.find('input[name="address"]').first().simulate('change', {
          target: {
            value: addresses[token],
            name: 'address',
          },
        });
        expect(wrapper.find('input[name="address"]')).toHaveClassName('error');
        expect(wrapper).toContainMatchingElement('.error');
      });

      it(`should show error on invalid address - ${token}`, () => {
        wrapper.find('input[name="address"]').first().simulate('change', {
          target: {
            value: 'invalidAddress',
            name: 'address',
          },
        });
        expect(wrapper.find('input[name="address"]')).toHaveClassName('error');
        expect(wrapper).toContainMatchingElement('.error');
      });

      it(`should show error on label too long - ${token}`, () => {
        wrapper.find('input[name="label"]').first().simulate('change', {
          target: {
            value: 'Really long bookmark name',
            name: 'label',
          },
        });
        expect(wrapper.find('input[name="label"]')).toHaveClassName('error');
        expect(wrapper).toContainMatchingElement('.error');
      });
    });
  });
});
