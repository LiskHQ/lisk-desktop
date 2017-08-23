import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import PropTypes from 'prop-types';
import sinonStubPromise from 'sinon-stub-promise';
import configureMockStore from 'redux-mock-store';
import * as delegateApi from '../../utils/api/delegate';
import * as votingActions from '../../actions/voting';
import VoteAutocompleteContainer, { VoteAutocomplete } from './voteAutocomplete';

sinonStubPromise(sinon);
chai.use(sinonChai);

const props = {
  activePeer: {},
  voted: [],
  votedList: [
    {
      username: 'yashar',
    },
    {
      username: 'tom',
    },
  ],
  unvotedList: [
    {
      username: 'john',
    },
    {
      username: 'test',
    },
  ],
  addedToVoteList: sinon.spy(),
  removedFromVoteList: sinon.spy(),
};
let wrapper;

const store = configureMockStore([])({
  peers: {},
  voting: {
    votedList: [],
    unvotedList: [],
  },
  account: {},
});

describe('VoteAutocompleteContainer', () => {
  beforeEach(() => {
    wrapper = mount(<VoteAutocompleteContainer {...props} store={store} />, {
      context: { store },
      childContextTypes: { store: PropTypes.object.isRequired },
    });
  });
  it('should render VoteAutocomplete', () => {
    expect(wrapper.find('VoteAutocomplete').exists()).to.be.equal(true);
  });
  it('should bind addedToVoteList action to ForgingComponent props.addedToVoteList', () => {
    const actionsSpy = sinon.spy(votingActions, 'addedToVoteList');
    wrapper.find('VoteAutocomplete').props().addedToVoteList([]);
    expect(actionsSpy).to.be.calledWith();
  });

  it('should bind removedFromVoteList action to ForgingComponent props.removedFromVoteList', () => {
    const actionsSpy = sinon.spy(votingActions, 'removedFromVoteList');
    wrapper.find('VoteAutocomplete').props().removedFromVoteList([]);
    expect(actionsSpy).to.be.calledWith();
  });
});
describe('VoteAutocomplete', () => {
  let voteAutocompleteApiMock;
  let unvoteAutocompleteApiMock;
  beforeEach(() => {
    sinon.spy(VoteAutocomplete.prototype, 'keyPress');
    sinon.spy(VoteAutocomplete.prototype, 'handleArrowDown');
    sinon.spy(VoteAutocomplete.prototype, 'handleArrowUp');

    voteAutocompleteApiMock = sinon.stub(delegateApi, 'voteAutocomplete');
    unvoteAutocompleteApiMock = sinon.stub(delegateApi, 'unvoteAutocomplete');
    wrapper = mount(<VoteAutocomplete {...props} store={store} />);
  });
  afterEach(() => {
    voteAutocompleteApiMock.restore();
    unvoteAutocompleteApiMock.restore();
    VoteAutocomplete.prototype.keyPress.restore();
    VoteAutocomplete.prototype.handleArrowDown.restore();
    VoteAutocomplete.prototype.handleArrowUp.restore();
  });

  it('should suggestionStatus(false, className) change value of className in state', () => {
    const clock = sinon.useFakeTimers();
    wrapper.instance().suggestionStatus(false, 'className');
    clock.tick(200);
    expect(wrapper.state('className').match(/hidden/g)).to.have.lengthOf(1);
  });

  it('should search hide suggestion boxes when value is equal to ""', () => {
    sinon.spy(VoteAutocomplete.prototype, 'setState');
    wrapper.instance().search('votedListSearch', '');
    const clock = sinon.useFakeTimers();
    clock.tick(250);

    expect(wrapper.state('votedResult')).to.have.lengthOf(0);
    expect(wrapper.state('votedSuggestionClass').match(/hidden/g)).to.have.lengthOf(1);
    expect(wrapper.state('unvotedSuggestionClass').match(/hidden/g)).to.have.lengthOf(1);
    VoteAutocomplete.prototype.setState.restore();
  });
  it('search should call "voteAutocomplete" when name is equal to "votedListSearch"', () => {
    const clock = sinon.useFakeTimers();
    voteAutocompleteApiMock.returnsPromise().resolves({ success: true })
    .returnsPromise().resolves([]);
    // sinon.stub(delegateApi, 'listDelegates').returnsPromise().resolves({ success: true });
    wrapper.instance().search('votedListSearch', 'val');
    clock.tick(250);
    expect(wrapper.state('votedSuggestionClass')).to.be.equal('');
  });

  it('search should call "unvoteAutocomplete" when name is equal to "unvotedListSearch"', () => {
    const clock = sinon.useFakeTimers();
    unvoteAutocompleteApiMock.returnsPromise().resolves([]);
    wrapper.instance().search('unvotedListSearch', 'val');
    clock.tick(250);
    expect(wrapper.state('unvotedSuggestionClass')).to.be.equal('');
  });

  it('should "votedSearchKeydown" call "keyPress"', () => {
    wrapper.instance().votedSearchKeyDown({});
    expect(VoteAutocomplete.prototype.keyPress).to.have.property('callCount', 1);
  });

  it('should "unvotedSearchKeydown" call "keyPress"', () => {
    wrapper.instance().unvotedSearchKeyDown({});
    expect(VoteAutocomplete.prototype.keyPress).to.have.property('callCount', 1);
  });

  it('should keyPress call "handleArrowDown" when event.keyCode is equal to 40', () => {
    const list = [
      { address: 'address 0' },
      { address: 'address 1', hovered: true },
      { address: 'address 2' },
    ];
    wrapper.setState({ votedResult: list });
    wrapper.instance().keyPress({ keyCode: 40 }, 'votedSuggestionClass', 'votedResult');
    expect(VoteAutocomplete.prototype.handleArrowDown).to.have.property('callCount', 1);
  });
  it('should handleArrowDown select first item in list when no one is selected', () => {
    const list = [
      { address: 'address 0' },
      { address: 'address 1' },
      { address: 'address 2' },
    ];
    wrapper.setState({ votedResult: list });
    wrapper.instance().handleArrowDown(wrapper.state('votedResult'), 'votedResult');
    expect(wrapper.state('votedResult')[0].hovered).to.have.be.equal(true);
  });

  it('should keyPress call "handleArrowUp" when event.keyCode is equal to 38', () => {
    const list = [
      { address: 'address 0' },
      { address: 'address 1', hovered: true },
    ];
    wrapper.setState({ votedResult: list });
    wrapper.instance().keyPress({ keyCode: 38 }, 'votedSuggestionClass', 'votedResult');
    expect(VoteAutocomplete.prototype.handleArrowUp).to.have.property('callCount', 1);
  });

  it('should keyPress hide suggestions when event.keyCode is equal to 27', () => {
    const returnValue = wrapper.instance()
      .keyPress({ keyCode: 27 }, 'votedSuggestionClass', 'votedResult');
    expect(wrapper.state('votedSuggestionClass').match(/hidden/g)).to.have.lengthOf(1);
    expect(returnValue).to.be.equal(false);
  });

  it(`should keyPress call "addToVoted" when event.keyCode is equal to 13 and 
    list name is equal to votedResult`, () => {
    const list = [{ address: 'address 1', hovered: true }];
    wrapper.setState({ votedResult: list });
    const returnValue = wrapper.instance()
      .keyPress({ keyCode: 13 }, 'votedSuggestionClass', 'votedResult');
    expect(props.addedToVoteList).to.have.property('callCount', 1);
    expect(returnValue).to.be.equal(false);
  });

  it(`should keyPress call "removedFromVoteList" when event.keyCode is equal to 13 and 
    list name is equal to unvotedResult`, () => {
    const list = [{ address: 'address 1', hovered: true }];
    wrapper.setState({ unvotedResult: list });
    const returnValue = wrapper.instance()
      .keyPress({ keyCode: 13 }, 'unvotedSuggestionClass', 'unvotedResult');
    expect(props.removedFromVoteList).to.have.property('callCount', 1);
    expect(returnValue).to.be.equal(false);
  });
});
