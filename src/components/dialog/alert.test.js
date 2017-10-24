import PropTypes from 'prop-types';
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Alert from './alert';
import i18n from '../../i18n';


describe('Alert', () => {
  let wrapper;
  let closeSpy;
  const text = 'some random text';
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    closeSpy = sinon.spy();
    wrapper = mount(<Alert text={text} closeDialog={closeSpy} />, options);
  });

  it('renders paragraph with props.text', () => {
    expect(wrapper.find('p').text()).to.equal(text);
  });

  it('renders "Ok" Button', () => {
    expect(wrapper.find('Button').text()).to.equal('Ok');
  });

  it('renders "Ok" Button that calls props.closeDialog on click', () => {
    wrapper.find('Button').simulate('click');
    expect(closeSpy).to.have.been.calledWith();
  });
});
