import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import PropTypes from 'prop-types';

import i18n from '../../i18n';
import AddAccountCard from './addAccountCard';

describe('AddAccountCard', () => {
  let wrapper;
  let props;

  it('should call addAccount on click addAccountCard', () => {
    props = {
      t: spy(),
      addAccount: spy(),
    };

    wrapper = mount(<AddAccountCard {...props} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });

    wrapper.find(AddAccountCard).simulate('click');
    expect(props.addAccount).to.have.been.calledWith();
  });
});
