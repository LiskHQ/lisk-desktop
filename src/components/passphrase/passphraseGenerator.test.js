import React from 'react';
import { expect } from 'chai';
import { spy, mock } from 'sinon';
import { mount, shallow } from 'enzyme';
import PassphraseGenerator from './passphraseGenerator';


describe('PassphraseConfirmator', () => {
  describe('seedGenerator', () => {
    const props = {
      changeHandler: () => {},
    };
    const mockEvent = {
      pageX: 140,
      pageY: 140,
    };

    it('calls setState to setValues locally', () => {
      const wrapper = shallow(<PassphraseGenerator changeHandler={props.changeHandler}/>);
      const spyFn = spy(wrapper.instance(), 'setState');
      wrapper.instance().seedGenerator(mockEvent);
      expect(spyFn).to.have.been.calledWith();
      wrapper.instance().setState.restore();
    });

    it('shows an Input fallback if this.isTouchDevice()', () => {
      const wrapper = mount(<PassphraseGenerator changeHandler={props.changeHandler}/>);
      const isTouchDeviceMock = mock(wrapper.instance()).expects('isTouchDevice');
      isTouchDeviceMock.returns(true);
      wrapper.instance().setState({}); // to rerender the component
      expect(wrapper.find('.touch-fallback textarea')).to.have.lengthOf(1);
    });

    it('shows at least some progress on pressing input if this.isTouchDevice()', () => {
      const wrapper = mount(<PassphraseGenerator changeHandler={props.changeHandler}/>);
      const isTouchDeviceMock = mock(wrapper.instance()).expects('isTouchDevice');
      isTouchDeviceMock.returns(true).twice();
      wrapper.instance().setState({}); // to rerender the component
      wrapper.find('.touch-fallback textarea').simulate('change', { target: { value: 'random key presses' } });
      expect(wrapper.find('ProgressBar').props().value).to.be.at.least(1);
    });

    it('removes mousemove event listener in componentWillUnmount', () => {
      const wrapper = mount(<PassphraseGenerator changeHandler={props.changeHandler}/>);
      const documentSpy = spy(document, 'removeEventListener');
      wrapper.instance().componentWillUnmount();
      expect(documentSpy).to.have.be.been.calledWith('mousemove');
      documentSpy.restore();
    });

    it('sets "data" and "lastCaptured" if distance is over 120', () => {
      const wrapper = shallow(<PassphraseGenerator changeHandler={props.changeHandler}/>);
      wrapper.instance().seedGenerator(mockEvent);

      expect(wrapper.instance().state.data).to.not.equal(undefined);
      expect(wrapper.instance().state.lastCaptured).to.deep.equal({
        x: 140,
        y: 140,
      });
    });

    it('should do nothing if distance is bellow 120', () => {
      const wrapper = shallow(<PassphraseGenerator changeHandler={props.changeHandler}/>);
      const nativeEvent = {
        pageX: 10,
        pageY: 10,
      };
      wrapper.instance().seedGenerator(nativeEvent);

      expect(wrapper.instance().state.data).to.be.equal(undefined);
      expect(wrapper.instance().state.lastCaptured).to.deep.equal({
        x: 0,
        y: 0,
      });
    });

    it('should generate passphrase if seed is completed', () => {
      const wrapper = shallow(<PassphraseGenerator changeHandler={props.changeHandler}/>);
      // set mock data
      wrapper.instance().setState({
        data: {
          seed: ['e6', '3c', 'd1', '36', 'e9', '70', '5f',
            'c0', '4d', '31', 'ef', 'b8', 'd6', '53', '48', '11'],
          percentage: 100,
          step: 1,
          byte: [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0],
        },
      });

      wrapper.instance().seedGenerator(mockEvent);

      expect(wrapper.instance().state.passphrase).to.not.equal(undefined);
    });
  });
});
