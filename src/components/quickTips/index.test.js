import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import i18n from '../../i18n';
import QuickTip from './';

describe('QuickTip', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      t: spy(),
      i18n,
    };
    wrapper = mount(<QuickTip {...props} />);
  });

  it('should render QuickTip', () => {
    expect(wrapper).to.have.descendants('.quickTips');
  });
});
