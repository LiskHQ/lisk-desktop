import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import store from '../../store';
import Account from './account';
import ClickToSend from '../clickToSend';

describe('Account', () => {
  let props;

  beforeEach(() => {
    props = {
      t: key => key,
      i18n: {},
      store: {},
      onActivePeerUpdated: sinon.spy(),
      peers: {
        status: {
          online: false,
        },
        data: {
          currentPeer: 'localhost',
          port: 4000,
          options: {
            name: 'Custom Node',
          },
        },
      },
      account: {
        isDelegate: false,
        address: '16313739661670634666L',
        username: 'lisk-nano',
        balance: 1e8,
      },
    };
  });

  it('should render 3 article tags', () => {
    const wrapper = shallow(<Account {...props} />);
    expect(wrapper.find('article')).to.have.lengthOf(3);
  });

  it('depicts being online when peers.status.online is true', () => {
    props.peers.status.online = true;
    const wrapper = shallow(<Account {...props} />);
    const expectedValue = 'check';
    expect(wrapper.find('.material-icons').text()).to.be.equal(expectedValue);
  });

  it('should render balance with ClickToSend component', () => {
    const wrapper = shallow(<Account {...props} />, {
      context: { store },
      childContextTypes: {
      },
    });
    expect(wrapper.find('.balance').find(ClickToSend)).to.have.lengthOf(1);
  });
});
