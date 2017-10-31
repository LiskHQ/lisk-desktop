import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import Passphrase from './passphrase';

const fakeStore = configureStore();

describe('Passphrase Component', () => {
  let wrapper;
  const clock = sinon.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'Date'],
  });
  const props = {
    t: key => key,
  };

  beforeEach(() => {
    const store = fakeStore({
      account: {
        balance: 100e8,
      },
    });
    wrapper = mount(<Passphrase {...props} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('should render 2 buttons', () => {
    expect(wrapper.find('button')).to.have.lengthOf(2);
  });

  it('should initially render InfoParagraph', () => {
    expect(wrapper.find('InfoParagraph')).to.have.lengthOf(1);
  });

  it.skip('should render PassphraseGenerator component if step is equal info', () => {
    wrapper.find('.primary-button').simulate('click');
    clock.tick(100);
    expect(wrapper.find('PassphraseGenerator')).to.have.lengthOf(1);
  });

  it.skip('should render PassphraseVerifier component if step is equal confirm', () => {
    expect(wrapper.find('PassphraseVerifier')).to.have.lengthOf(1);
  });
});
