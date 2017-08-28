import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { shallow } from 'enzyme';
import PassphraseGenerator from './passphraseGenerator';


describe('PassphraseConfirmator', () => {
  describe('seedGenerator', () => {
    const props = {
      changeHandler: () => {},
    };
    const mockEvent = {
      nativeEvent: {
        pageX: 140,
        pageY: 140,
      },
    };

    it('calls setState to setValues locally', () => {
      const wrapper = shallow(<PassphraseGenerator changeHandler={props.changeHandler}/>);
      const spyFn = spy(wrapper.instance(), 'setState');
      wrapper.instance().seedGenerator(mockEvent);
      expect(spyFn).to.have.been.calledWith();
      wrapper.instance().setState.restore();
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
      const shortDistanceEvent = {
        nativeEvent: {
          pageX: 10,
          pageY: 10,
        },
      };
      wrapper.instance().seedGenerator(shortDistanceEvent);

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
