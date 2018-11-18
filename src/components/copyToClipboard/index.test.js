import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import i18n from '../../i18n';
import CopyToClipboard from './index';

describe('CopyToClipboard', () => {
  let wrapper;
  let clock;
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
  const copiedText = ' Copied!';

  beforeEach(() => {
    wrapper = mount(<CopyToClipboard {...props} />, options);
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should show "Copied!" on click', () => {
    wrapper.find('.default').simulate('click');
    expect(wrapper.find('.copied')).to.have.text(copiedText);
  });

  it('should hide "Copied!" after 3000ms', () => {
    wrapper.find('.default').simulate('click');
    clock.tick(2900);
    expect(wrapper.find('.copied')).to.have.text(copiedText);
    clock.tick(2000);
    wrapper.update();
    expect(wrapper.find('.copied')).to.have.length(0);
    expect(wrapper.find('.default')).to.have.text(props.text);
  });
});
