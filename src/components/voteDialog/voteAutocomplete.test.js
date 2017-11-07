import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import * as delegateApi from '../../utils/api/delegate';
import i18n from '../../i18n';
import { VoteAutocompleteRaw as VoteAutocomplete } from './voteAutocomplete';

const votes = {
  username1: { publicKey: 'sample_key_1', confirmed: true, unconfirmed: false },
  username2: { publicKey: 'sample_key_2', confirmed: false, unconfirmed: true },
};
const delegates = [
  { username: 'username1', publicKey: '123HG3452245L' },
  { username: 'username2', publicKey: '123HG3522345L' },
];
const unvotedDelegate = [
  { username: 'username3', publicKey: '123HG3522445L' },
  { username: 'username4', publicKey: '123HG3522545L' },
];
const props = {
  activePeer: {},
  votes,
  delegates,
  voteToggled: sinon.spy(),
  t: key => key,
};
let wrapper;
const keyCodes = {
  arrowDown: 40,
  arrowUp: 38,
  enter: 13,
  escape: 27,
};

const store = configureMockStore([])({
  peers: {},
  voting: {
    votes,
    delegates,
  },
  account: {},
});

describe('VoteAutocomplete', () => {
  let voteAutocompleteApiMock;
  let unvoteAutocompleteApiMock;
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    sinon.spy(VoteAutocomplete.prototype, 'keyPress');
    sinon.spy(VoteAutocomplete.prototype, 'handleArrowDown');
    sinon.spy(VoteAutocomplete.prototype, 'handleArrowUp');

    voteAutocompleteApiMock = sinon.mock(delegateApi, 'voteAutocomplete');
    unvoteAutocompleteApiMock = sinon.mock(delegateApi, 'unvoteAutocomplete');
    wrapper = mount(<VoteAutocomplete {...props} store={store} i18n={i18n}/>);
  });

  afterEach(() => {
    clock.restore();
    voteAutocompleteApiMock.restore();
    unvoteAutocompleteApiMock.restore();
    VoteAutocomplete.prototype.keyPress.restore();
    VoteAutocomplete.prototype.handleArrowDown.restore();
    VoteAutocomplete.prototype.handleArrowUp.restore();
  });

  it('should suggest with full username if finds a non-voted delegate with a username starting with given string', () => {
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().resolves([unvotedDelegate[0]]);
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });

    clock.tick(300);
    expect(wrapper.find('Card .vote-auto-complete-list ul').html().indexOf(unvotedDelegate[0].username)).to.be.greaterThan(-1);
    voteAutocompleteApiStub.restore();
  });

  it('should suggest with full username if dows not find a non-voted delegate with a username starting with given string', () => {
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().rejects([]);
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });

    clock.tick(400);
    expect(wrapper.find('Card .vote-auto-complete-list ul')).to.be.blank();
    voteAutocompleteApiStub.restore();
  });

  it('search should call "voteAutocomplete" when name is equal to "votedListSearch" when search term exists', () => {
    const existingSearchTerm = 'username2';
    const delegateApiMock = sinon.mock(delegateApi).expects('voteAutocomplete');

    delegateApiMock.once().withExactArgs(props.activePeer, existingSearchTerm, props.votes)
      .returnsPromise().resolves(delegates);

    wrapper.find('.votedListSearch input').simulate('change', { target: { value: existingSearchTerm } });
    clock.tick(250);
    expect(wrapper.state('votedSuggestionClass')).to.be.equal('');

    delegateApiMock.restore();
  });

  it('search should call "voteAutocomplete" when name is equal to "votedListSearch" when search term does not exist', () => {
    const nonExistingSearchTerm = 'doesntexist';
    const delegateApiMock = sinon.mock(delegateApi).expects('voteAutocomplete');

    delegateApiMock.once().withExactArgs(props.activePeer, nonExistingSearchTerm, props.votes)
      .returnsPromise().resolves([]);


    wrapper.find('.votedListSearch input').simulate('change', { target: { value: nonExistingSearchTerm } });
    clock.tick(250);
    expect(wrapper.state('votedSuggestionClass').match(/hidden/g)).to.have.lengthOf(1);

    delegateApiMock.restore();
  });

  it('search should call "unvoteAutocomplete" when name is equal to "unvotedListSearch" when search term exists', () => {
    const existingSearchTerm = 'username1';
    const delegateApiMock = sinon.mock(delegateApi).expects('unvoteAutocomplete');

    delegateApiMock.once().withExactArgs(existingSearchTerm, props.votes)
      .returnsPromise().resolves(delegates);

    wrapper.find('.unvotedListSearch input').simulate('change', { target: { value: existingSearchTerm } });
    clock.tick(250);
    expect(wrapper.state('unvotedSuggestionClass')).to.be.equal('');

    delegateApiMock.restore();
  });

  it('search should call "unvoteAutocomplete" when name is equal to "unvotedListSearch" when search term does not exists', () => {
    const nonExistingSearchTerm = 'username2';
    const delegateApiMock = sinon.mock(delegateApi).expects('unvoteAutocomplete');

    delegateApiMock.once().withExactArgs(nonExistingSearchTerm, props.votes)
      .returnsPromise().resolves([]);

    wrapper.find('.unvotedListSearch input').simulate('change', { target: { value: nonExistingSearchTerm } });
    clock.tick(250);
    expect(wrapper.state('unvotedSuggestionClass').match(/hidden/g)).to.have.lengthOf(1);

    delegateApiMock.restore();
  });

  it('should let you choose one of the options by arrow down', () => {
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().resolves(unvotedDelegate);
    // write a username
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });
    clock.tick(400);

    // select it with arrow down
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: keyCodes.arrowDown });
    clock.tick(200);
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: keyCodes.enter });
    voteAutocompleteApiStub.restore();
    expect(props.voteToggled).to.have.been.calledWith({
      publicKey: unvotedDelegate[0].publicKey,
      username: unvotedDelegate[0].username,
    });
  });

  it('should let you navigate and choose one of the options in voteList using arrow up/down', () => {
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().resolves(unvotedDelegate);
    // write a username
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });
    clock.tick(400);

    // Arrow down
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: keyCodes.arrowDown });
    // Arrow down
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: keyCodes.arrowDown });
    // Arrow up
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: keyCodes.arrowUp });
    // Hit enter
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: keyCodes.enter });
    voteAutocompleteApiStub.restore();
    expect(props.voteToggled).to.have.been.calledWith({
      publicKey: unvotedDelegate[0].publicKey,
      username: unvotedDelegate[0].username,
    });
  });

  it('should let you navigate and then escape the suggestion list', () => {
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().resolves(unvotedDelegate);
    // write a username
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });
    clock.tick(400);

    // Arrow down
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: keyCodes.arrowDown });
    // Arrow down
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: keyCodes.arrowDown });
    // Arrow up
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: keyCodes.arrowUp });
    // Hit enter
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: keyCodes.escape });
    voteAutocompleteApiStub.restore();
    clock.tick(400);
    expect(wrapper.find('Card .vote-auto-complete-list').at(0).prop('className')).to.include('hidden');
  });

  it('should remove suggestion list if you clean the input', () => {
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().resolves(unvotedDelegate);
    // write a username
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });
    clock.tick(400);
    wrapper.update();
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: '' } });
    voteAutocompleteApiStub.restore();
    clock.tick(400);
    wrapper.update();
    expect(wrapper.find('Card .vote-auto-complete-list ul')).to.be.blank();
  });

  it('should hide suggestion list if you blur the input', () => {
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().resolves(unvotedDelegate);
    // write a username
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });
    clock.tick(400);
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('blur', {});
    voteAutocompleteApiStub.restore();
    clock.tick(200);
    wrapper.update();
    expect(wrapper.find('Card .vote-auto-complete-list').at(0).prop('className')).to.include('hidden');
  });

  it('should suggest with full username to unvote if finds a voted delegate with a username starting with given string', () => {
    const unvoteAutocompleteApiStub = sinon.stub(delegateApi, 'unvoteAutocomplete');
    unvoteAutocompleteApiStub.returnsPromise().resolves([delegates[1]]);
    wrapper.find('.unvotedListSearch input').simulate('change', { target: { value: 'user' } });

    clock.tick(300);
    expect(wrapper.find('Card .unvote-auto-complete-list ul').html()).to.include(delegates[1].username);
    unvoteAutocompleteApiStub.restore();
  });

  it('should let you navigate and choose one of the options in unvoteList using arrow up/down', () => {
    const unvoteAutocompleteApiStub = sinon.stub(delegateApi, 'unvoteAutocomplete');
    unvoteAutocompleteApiStub.returnsPromise().resolves([delegates[1]]);
    // write a username
    wrapper.find('.unvotedListSearch input').simulate('change', { target: { value: 'user' } });
    clock.tick(400);

    // Arrow down
    wrapper.find('.unvotedListSearch input').simulate('keyDown', { keyCode: keyCodes.arrowDown });
    // Hit enter
    wrapper.find('.unvotedListSearch input').simulate('keyDown', { keyCode: keyCodes.enter });
    unvoteAutocompleteApiStub.restore();
    expect(props.voteToggled).to.have.been.calledWith({
      publicKey: delegates[1].publicKey,
      username: delegates[1].username,
    });
  });
});
