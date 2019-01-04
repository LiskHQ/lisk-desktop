import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import sinon from 'sinon';
import i18n from '../../i18n';
import ChooseAvatar from './chooseAvatar';

describe('V2 Register Process', () => {
  let wrapper;
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    handleSelectAvatar: sinon.spy(),
    selected: '',
  };

  beforeEach(() => {
    wrapper = mount(<MemoryRouter>
      <ChooseAvatar {...props} />
    </MemoryRouter>, options);
  });

  it('Should render with five avatars and confirm button disabled', () => {
    expect(wrapper.find('AccountVisual')).to.have.length(5);
    expect(wrapper.find('Button').at(1).prop('disabled'));
  });

  it('Should pass selected address to handler function', () => {
    const confirmButton = wrapper.find('Button').at(1);
    const avatar = wrapper.find('AccountVisual').at(2);
    expect(confirmButton.prop('disabled'));
    avatar.simulate('click');
    expect(props.handleSelectAvatar).to.have.been.calledWith(avatar.prop('address'));

    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        selected: avatar.prop('address'),
      }),
    });

    expect(wrapper.find('ChooseAvatar').prop('selected')).to.be.eql(avatar.prop('address'));
  });
});
