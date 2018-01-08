import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import Setting from './setting';
import i18n from '../../i18n';


describe('Setting', () => {
  const history = {
    location: {
      pathname: '/main/voting',
    },
    push: sinon.spy(),
  };

  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-nano',
  };
  const store = configureMockStore([])({
    account,
    activePeerSet: () => {},
  });

  const options = {
    context: { store, history, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };


  let clock;

  const t = key => key;
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<MemoryRouter><Setting store={store} t={t}/></MemoryRouter>, options);
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  });

  afterEach(() => {
    clock.restore();
    i18n.changeLanguage('en');
  });

  it('should render "ReactSwipe" component', () => {
    expect(wrapper.find('ReactSwipe').exists()).to.equal(true);
  });

  it('should click on #carouselNav li change the slider', () => {
    wrapper.find('#carouselNav li').at(2).simulate('click');
    wrapper.update();
    clock.tick(500);
    wrapper.update();
    expect(wrapper.find('#carouselNav li').at(2).props().className).to.be.include('activeSlide');
  });

  it('should click on "languageSwitcher" change the language to "de"', () => {
    // const languageSpy = sinon.spy(i18n, 'changeLanguage');
    wrapper.find('.language-switcher .circle').simulate('click');
    wrapper.update();
    expect(i18n.language).to.be.equal('de');
  });

  it('should second click on "languageSwitcher" change the language to "en"', () => {
    wrapper.find('.language-switcher .circle').simulate('click');
    wrapper.update();
    wrapper.find('.language-switcher .circle').simulate('click');
    wrapper.update();
    expect(i18n.language).to.be.equal('en');
  });
});

