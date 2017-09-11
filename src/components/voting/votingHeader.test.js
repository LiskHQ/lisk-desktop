import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import VotingHeader from './votingHeader';

describe('VotingHeader', () => {
  let wrapper;
  const mockStore = configureStore();
  const props = {
    store: mockStore({ runtime: {} }),
    search: sinon.spy(),
    votedDelegates: [
      {
        username: 'yashar',
        address: 'address 1',
      },
      {
        username: 'tom',
        address: 'address 2',
      },
    ],
    votedList: [
      {
        username: 'yashar',
        address: 'address 1',
        pending: true,
      },
      {
        username: 'tom',
        address: 'address 2',
      },
    ],
    unvotedList: [
      {
        username: 'yashar',
        address: 'address 1',
      },
      {
        username: 'tom',
        address: 'address 2',
        pending: true,
      },
    ],
    setActiveDialog: () => {},
    addToUnvoted: sinon.spy(),
    addToVoteList: sinon.spy(),
  };

  beforeEach(() => {
    wrapper = mount(<VotingHeader {...props} />, {
      context: { store: mockStore },
      childContextTypes: { store: PropTypes.object.isRequired },
    });
  });

  it('should render an Input', () => {
    expect(wrapper.find('Input')).to.have.lengthOf(1);
  });
  it('should render 2 menuItem', () => {
    expect(wrapper.find('MenuItem')).to.have.lengthOf(2);
  });

  it('should render i#searchIcon with text of "search" when this.search is not called', () => {
    // expect(wrapper.find('i.material-icons')).to.have.lengthOf(1);
    expect(wrapper.find('#searchIcon').text()).to.be.equal('search');
  });

  it('should render i#searchIcon with text of "close" when this.search is called', () => {
    wrapper.instance().search('query', '555');
    expect(wrapper.find('#searchIcon').text()).to.be.equal('close');
  });

  it('should this.props.search when this.search is called', () => {
    const clock = sinon.useFakeTimers();
    wrapper.instance().search('query', '555');
    clock.tick(250);
    expect(props.search).to.have.been.calledWith('555');
  });

  it('click on #searchIcon should clear value of search input', () => {
    wrapper.instance().search('query', '555');
    wrapper.find('#searchIcon').simulate('click');
    expect(wrapper.state('query')).to.be.equal('');
  });
});
