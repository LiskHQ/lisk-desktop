import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import i18n from '../../i18n';
import Options from './confirmPassphraseOptions';

describe('V2 Register Process - Confirm Passphrase Options', () => {
  let wrapper;
  const handleSelect = sinon.spy();

  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    optionIndex: 0,
    options: ['alarm', 'easily', 'filter'],
    answers: [],
    handleSelect,
    hasErrors: false,
    isCorrect: false,
    enabled: true,
  };

  beforeEach(() => {
    wrapper = mount(<Options {...props} />, options);
  });

  it('Should render with three options and enabled', () => {
    expect(wrapper.prop('enabled')).to.equal(true);
    expect(wrapper.find('.option')).to.have.length(3);
  });

  it('Should call handler with selected choice when clicked', () => {
    const randomChoice = wrapper.find('.option Button').at(Math.floor(Math.random() * 2));
    randomChoice.simulate('click');
    expect(props.handleSelect).to.have.been.calledWith(randomChoice.text(), props.optionIndex);
  });

  it('Should render with chosen answer', () => {
    const answer = 'alarm';
    wrapper.setProps({ answers: [answer] });
    expect(wrapper.find('.answered')).to.have.length(1);
    expect(wrapper.find('.answer').text()).to.equal(answer);
  });

  it('Should call handler with empty choice when clicking on answered', () => {
    wrapper.setProps({ answers: ['alarm'] });
    wrapper.find('.answer').simulate('click');
    expect(props.handleSelect).to.have.been.calledWith(null, props.optionIndex);
  });

  it('Should render with error', () => {
    wrapper.setProps({ answers: ['alarm'], hasErrors: true });
    expect(wrapper.find('.hasErrors')).to.have.length(1);
  });

  it('Should render with correct icon', () => {
    wrapper.setProps({ answers: ['alarm'], isCorrect: true });
    expect(wrapper.find('.isCorrect')).to.have.length(1);
  });
});
