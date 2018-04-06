import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import i18n from '../../i18n';
import CopyToClipboard from './index';

describe('CopyToClipboard', () => {
  let wrapper;

  const props = {
    text: 'test',
    className: 'className',
    value: 2,
    t: key => key,
    i18n,
  };
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    wrapper = mount(<CopyToClipboard {...props} />, options);
  });

  it('should click on span.default render "Copied!"', () => {
    const expectValue = ' Copied!';
    wrapper.find('span.default').simulate('click');
    expect(wrapper.find('span.copied').text()).to.be.equal(expectValue);
  });

  it('should span.copied be gone after 3000ms', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
    wrapper.find('span.default').simulate('click');
    clock.tick(3010);
    expect(wrapper.find('span.copied')).to.have.lengthOf(1);
    clock.restore();
  });
});
