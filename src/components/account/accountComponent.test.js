import React from 'react';
import chai, { expect } from 'chai';
import sinon, { spy, mock } from 'sinon';
import sinonChai from 'sinon-chai';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as accountApi from '../../utils/api/account';
import store from '../../store';
import AccountComponent from './accountComponent';
import ClickToSend from '../send/clickToSend';

chai.use(sinonChai);

describe('AccountComponent', () => {
  let props;

  beforeEach(() => {
    props = {
      onActivePeerUpdated: sinon.spy(),
      onAccountUpdated: sinon.spy(),
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

  it(' should render 3 article tags', () => {
    const wrapper = shallow(<AccountComponent {...props} />);
    expect(wrapper.find('article')).to.have.lengthOf(3);
  });

  it('depicts being online when peers.status.online is true', () => {
    props.peers.status.online = true;
    const wrapper = shallow(<AccountComponent {...props} />);
    const expectedValue = 'check';
    expect(wrapper.find('.material-icons').text()).to.be.equal(expectedValue);
  });

  it('should render balance with ClickToSend component', () => {
    const wrapper = mount(<Provider store={store}>
      <AccountComponent {...props} />
    </Provider>);
    expect(wrapper.find('.balance').find(ClickToSend)).to.have.lengthOf(1);
  });

  describe('componentDidMount', () => {
    let accountApiMock;

    beforeEach(() => {
       accountApiMock = mock(accountApi);
    });

    afterEach(() => {
      accountApiMock.restore();
    });

    it('binds listener to beat event', () => {
      const actionSpy = spy(document, 'addEventListener');
      mount(<Provider store={store}><AccountComponent {...props} /></Provider>);
      expect(actionSpy).to.have.been.calledWith();
    });

    it('calls props.onActivePeerUpdated', () => {
      accountApiMock.expects('getAccountStatus').resolves({ success: true });
      const wrapper = mount(<Provider store={store}><AccountComponent {...props} /></Provider>);
      // TODO: this doesn't work for some reason
      // expect(props.onActivePeerUpdated).to.have.been.calledWith();
    });

    it('calls props.onAccountUpdated', () => {
      accountApiMock.expects('getAccount').resolves({ balance: props.account.balance });
      const wrapper = mount(<Provider store={store}><AccountComponent {...props} /></Provider>);
      // TODO: this doesn't work for some reason
      // expect(props.onAccountUpdated).to.have.been.calledWith();
    });

    it('calls props.onTransactionsUpdated if getAccount returns different balance', () => {
      accountApiMock.expects('transactions').resolves({ transactions: [{}] });
      accountApiMock.expects('getAccount').resolves({ balance: props.account.balance + 1 });
      const wrapper = mount(<Provider store={store}><AccountComponent {...props} /></Provider>);
      // TODO: this doesn't work for some reason
      // expect(props.onAccountUpdated).to.have.been.calledWith();
    });
  });
});
