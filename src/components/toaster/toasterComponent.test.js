import React from 'react';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import ToasterComponent from './toasterComponent';

chai.use(chaiEnzyme()); // Note the invocation at the end
describe('ToasterComponent', () => {
  let wrapper;
  const toasterProps = {
    label: 'test',
    type: 'success',
    hideToast: sinon.spy(),
  };

  beforeEach(() => {
    wrapper = mount(<ToasterComponent {...toasterProps} />);
  });

  it('renders <Snackbar /> component from react-toolbox', () => {
    expect(wrapper.find('Snackbar')).to.have.length(1);
  });

  describe('hideToast', () => {
    it('hides the toast and after the animation ends calls this.props.hideToast()', () => {
      const clock = sinon.useFakeTimers();
      wrapper.instance().hideToast();
      expect(wrapper.state('hidden')).to.equal(true);
      clock.tick(510);
      expect(wrapper.state('hidden')).to.equal(false);
      clock.restore();
      expect(toasterProps.hideToast.called).to.equal(true);
    });
  });
});
