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

  beforeEach(() => {
    sinon.spy(VoteAutocomplete.prototype, 'keyPress');
    sinon.spy(VoteAutocomplete.prototype, 'handleArrowDown');
    sinon.spy(VoteAutocomplete.prototype, 'handleArrowUp');

    voteAutocompleteApiMock = sinon.mock(delegateApi, 'voteAutocomplete');
    unvoteAutocompleteApiMock = sinon.mock(delegateApi, 'unvoteAutocomplete');
    wrapper = mount(<VoteAutocomplete {...props} store={store} i18n={i18n}/>);
  });

  afterEach(() => {
    voteAutocompleteApiMock.restore();
    unvoteAutocompleteApiMock.restore();
    VoteAutocomplete.prototype.keyPress.restore();
    VoteAutocomplete.prototype.handleArrowDown.restore();
    VoteAutocomplete.prototype.handleArrowUp.restore();
  });

  it('should suggest with full username if finds a non-voted delegate with a username starting with given string', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().resolves([{ username: 'username3' }]);
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });

    clock.tick(300);
    expect(wrapper.find('Card .vote-auto-complete-list ul').html().indexOf('username3')).to.be.greaterThan(-1);
    voteAutocompleteApiStub.restore();
  });

  it('should suggest with full username if dows not find a non-voted delegate with a username starting with given string', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().rejects([]);
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });

    clock.tick(400);
    const reg = /><\/ul>/;
    expect(reg.test(wrapper.find('Card .vote-auto-complete-list ul').html())).to.be.equal(true);
    voteAutocompleteApiStub.restore();
  });

  it('search should call "voteAutocomplete" when name is equal to "votedListSearch" when search term exists', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
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
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
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
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
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
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
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
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().resolves(unvotedDelegate);
    // write a username
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });
    clock.tick(400);

    // select it with arrow down
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: 40 });
    clock.tick(200);
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: 13 });
    voteAutocompleteApiStub.restore();
    expect(props.voteToggled).to.have.been.calledWith({
      publicKey: unvotedDelegate[0].publicKey,
      username: unvotedDelegate[0].username,
    });
  });

  it('should let you navigate and choose one of the options by arrow up/down', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().resolves(unvotedDelegate);
    // write a username
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });
    clock.tick(400);

    // Arrow down
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: 40 });
    // Arrow down
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: 40 });
    // Arrow up
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: 38 });
    // Hit enter
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: 13 });
    voteAutocompleteApiStub.restore();
    expect(props.voteToggled).to.have.been.calledWith({
      publicKey: unvotedDelegate[0].publicKey,
      username: unvotedDelegate[0].username,
    });
  });

  it('should let you navigate and then escape the suggestion list', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().resolves(unvotedDelegate);
    // write a username
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });
    clock.tick(400);

    // Arrow down
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: 40 });
    // Arrow down
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: 40 });
    // Arrow up
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: 38 });
    // Hit enter
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: 27 });
    voteAutocompleteApiStub.restore();
    clock.tick(400);
    const reg = /><\/ul>/;
    expect(reg.test(wrapper.find('Card .vote-auto-complete-list ul').html())).to.be.equal(true);
  });

  it('should remove suggestion list if you clean the input', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().resolves(unvotedDelegate);
    // write a username
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });
    clock.tick(400);
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: '' } });
    clock.tick(400);
    voteAutocompleteApiStub.restore();
    clock.tick(400);
    const reg = /><\/ul>/;
    expect(reg.test(wrapper.find('Card .vote-auto-complete-list ul').html())).to.be.equal(true);
  });

  it('should hide suggestion list if you blur the input', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().resolves(unvotedDelegate);
    // write a username
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });
    clock.tick(400);
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('blur', {});
    clock.tick(400);
    voteAutocompleteApiStub.restore();
    clock.tick(400);
    const reg = /><\/ul>/;
    expect(reg.test(wrapper.find('Card .vote-auto-complete-list ul').html())).to.be.equal(true);
  });

  it('should suggest with full username to unvote if finds a voted delegate with a username starting with given string', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    const unvoteAutocompleteApiStub = sinon.stub(delegateApi, 'unvoteAutocomplete');
    unvoteAutocompleteApiStub.returnsPromise().resolves([delegates[1]]);
    wrapper.find('.unvotedListSearch input').simulate('change', { target: { value: 'user' } });

    clock.tick(300);
    expect(wrapper.find('Card .unvote-auto-complete-list ul').html()
      .indexOf(delegates[1].username)).to.be.greaterThan(-1);
    unvoteAutocompleteApiStub.restore();
  });

  it('should let you navigate and choose one of the options by arrow up/down', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    const unvoteAutocompleteApiStub = sinon.stub(delegateApi, 'unvoteAutocomplete');
    unvoteAutocompleteApiStub.returnsPromise().resolves([delegates[1]]);
    // write a username
    wrapper.find('.unvotedListSearch input').simulate('change', { target: { value: 'user' } });
    clock.tick(400);

    // Arrow down
    wrapper.find('.unvotedListSearch input').simulate('keyDown', { keyCode: 40 });
    // Hit enter
    wrapper.find('.unvotedListSearch input').simulate('keyDown', { keyCode: 13 });
    unvoteAutocompleteApiStub.restore();
    expect(props.voteToggled).to.have.been.calledWith({
      publicKey: delegates[1].publicKey,
      username: delegates[1].username,
    });
  });
});
