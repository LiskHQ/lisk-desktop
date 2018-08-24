import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { Tab, Tabs as ToolboxTabs } from 'react-toolbox';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import MainMenu from './mainMenu';
import routes from '../../constants/routes';

describe('MainMenu', () => {
  // Mocking store
  const peers = {
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
  };
  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-hub',
  };
  const store = configureMockStore([])({
    peers,
    account,
    activePeerSet: () => {},
    settings: {
      autoLog: true,
      advancedMode: true,
    },
  });

  const history = {
    location: {
      pathname: `${routes.delegates.path}`,
    },
    push: sinon.spy(),
  };


  const options = {
    context: { store, history, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
    lifecycleExperimental: true,
  };
  let clock;

  const t = key => key;

  const props = {
    showDelegate: false,
    t,
    account,
    store,
    history,
    showFeedback: sinon.spy(),
  };

  beforeEach(() => {
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should render react toolbox Tabs component', () => {
    const wrapper = mount(<MemoryRouter>
      <MainMenu {...props} />
    </MemoryRouter>, options);
    expect(wrapper.find(ToolboxTabs).exists()).to.equal(true);
  });

  it('should render 6 Button components if props.showDelegate', () => {
    const wrapper = mount(<MemoryRouter>
      <MainMenu {...props} showDelegate={true}/>
    </MemoryRouter>, options);
    expect(wrapper.find(Tab)).to.have.lengthOf(6);
  });

  it('should render 5 menu item components if !props.isDelegate', () => {
    const wrapper = mount(<MemoryRouter>
      <MainMenu {...props} />
    </MemoryRouter>, options);
    expect(wrapper.find(Tab)).to.have.lengthOf(5);
  });

  it('should all Tab be disabled except Settings, Dashboard and Help if !props.account.address', () => {
    const wrapper = mount(<MemoryRouter>
      <MainMenu {...props} account={{}} />
    </MemoryRouter>, options);
    expect(wrapper.find(Tab).at(0).props().disabled).not.to.be.equal(true);
    expect(wrapper.find(Tab).at(1).props().disabled).to.be.equal(true);
    expect(wrapper.find(Tab).at(2).props().disabled).to.be.equal(true);
    expect(wrapper.find(Tab).at(3).props().disabled).not.to.be.equal(true);
    expect(wrapper.find(Tab).at(4).props().disabled).not.to.be.equal(true);
  });

  it('should allow to change active menu item', () => {
    const wrapper = mount(<MemoryRouter>
      <MainMenu {...props} />
    </MemoryRouter>, options);

    expect(wrapper).to.not.have.descendants('#feedback');
    wrapper.find(Tab).at(1).simulate('click');
    expect(history.push).to.have.been.calledWith(`${routes.wallet.path}`);
  });

  it('should click on more activate the drawer', () => {
    const wrapper = mount(<MemoryRouter>
      <MainMenu {...props} />
    </MemoryRouter>, options);
    wrapper.find('.menu-button').simulate('click');
    clock.tick(100);
    wrapper.update();
    expect(wrapper.find('Drawer').props().active).to.be.equal(true);
  });

  it('should show feedback when param in url', () => {
    const wrapper = shallow(<MainMenu {...props} />, options);
    wrapper.setProps({
      history: {
        push: sinon.spy(),
        location: { pathname: `${routes.wallet.path}`, search: '?showFeedback=true' },
      },
    });
    wrapper.update();

    const feedbackBtn = wrapper.find('#feedback').first();
    expect(feedbackBtn.props().disabled).to.be.equal(false);
    wrapper.find(ToolboxTabs).at(1).props().onChange(1);
    expect(props.showFeedback).to.have.been.calledWith();
  });
});
