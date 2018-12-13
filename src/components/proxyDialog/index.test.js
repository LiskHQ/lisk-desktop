import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy, mock } from 'sinon';
import i18n from '../../i18n';
import ProxyDialog from './';

describe('ProxyDialog', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      callback: spy(),
      closeDialog: spy(),
      authInfo: { host: 'someProxy.com' },
      i18n,
    };
    wrapper = mount(<ProxyDialog {...props} />);
  });

  it('should render two Inputs and one Button', () => {
    expect(wrapper.find('Input')).to.have.lengthOf(2);
    expect(wrapper.find('Button')).to.have.lengthOf(1);
  });

  it('should submit the form to props.callback and localStorage', () => {
    const username = 'name';
    const password = 'pass';
    const localStorageMock = mock(localStorage);
    localStorageMock.expects('setItem').withExactArgs('proxyUsername', username);
    localStorageMock.expects('setItem').withExactArgs('proxyPassword', password);

    wrapper.find('.username input').simulate('change', { target: { value: username } });
    wrapper.find('.password input').simulate('change', { target: { value: password } });
    wrapper.find('form').simulate('submit');

    expect(props.callback).to.have.been.calledWith(username, password);
    expect(props.closeDialog).to.have.been.calledWith();

    localStorageMock.verify();
    localStorageMock.restore();
  });
});
