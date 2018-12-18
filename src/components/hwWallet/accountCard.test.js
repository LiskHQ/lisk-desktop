import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import PropTypes from 'prop-types';

import i18n from '../../i18n';
import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import AccountCard from './accountCard';

describe('AccountCard', () => {
  let wrapper;
  let props;

  it('should find ToolBoxInput when isEditMode true', () => {
    props = {
      account: {
        address: '123L',
      },
      hardwareAccountName: 'test',
      isEditMode: true,
      changeInput: spy(),
      onClickHandler: spy(),
      index: 0,
    };

    wrapper = mount(<AccountCard {...props} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });

    expect(wrapper.find(ToolBoxInput).exists()).to.equal(true);
  });

  it('should call changeInput when changing text in ToolBoxInput', () => {
    props = {
      account: {
        address: '123L',
      },
      hardwareAccountName: 'test',
      isEditMode: true,
      changeInput: spy(),
      onClickHandler: spy(),
      index: 0,
    };

    wrapper = mount(<AccountCard {...props} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });

    wrapper.find(ToolBoxInput).props().onChange('test');
    expect(props.changeInput).to.have.been.calledWith('test', '123L');
  });

  it('should call onClickHandler on click accountVisualWrapper', () => {
    props = {
      account: {
        address: '123L',
      },
      hardwareAccountName: 'test',
      isEditMode: false,
      changeInput: spy(),
      onClickHandler: spy(),
      index: 0,
    };

    wrapper = mount(<AccountCard {...props} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });
    wrapper.find('.accountVisualWrapper').simulate('click');
    expect(props.onClickHandler).to.have.been.calledWith({ address: '123L' }, 0);
  });
});
