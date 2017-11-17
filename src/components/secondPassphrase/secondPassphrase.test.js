import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import i18n from '../../i18n';
import SecondPassphrase from './secondPassphrase';
import Fees from '../../constants/fees';

describe('SecondPassphrase', () => {
  let wrapper;
  const peers = { data: {} };
  const account = {};
  const store = configureMockStore([])({
    peers,
    account,
    activePeerSet: () => {},
  });
  const options = {
    context: { store, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };
  const passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';

  describe('Authenticated', () => {
    const prop = {
      account,
      passphrase,
      peers,
      registerSecondPassphrase: spy(),
      t: key => key,
    };

    beforeEach(() => {
      wrapper = mount(<SecondPassphrase {...prop} />, options);
    });

    it('renders Passphrase component', () => {
      expect(wrapper.find('Passphrase')).to.have.length(1);
    });

    it('should mount SecondPassphrase with appropriate properties', () => {
      const props = wrapper.find('Passphrase').props();
      expect(props.securityNote).to.be.equal('Losing access to this passphrase will mean no funds can be sent from this account.');
      expect(props.useCaseNote).to.be.equal('your second passphrase will be required for all transactions sent from this account');
      expect(props.confirmButton).to.be.equal('Register');
      expect(props.fee).to.be.equal(Fees.setSecondPassphrase);
      expect(props.keepModal).to.be.equal(true);
      expect(typeof props.onPassGenerated).to.be.equal('function');
    });

    it('should call registerSecondPassphrase if props.onPassGenerated is called', () => {
      const props = wrapper.find('Passphrase').props();
      props.onPassGenerated('sample passphrase');
      expect(prop.registerSecondPassphrase).to.have.been.calledWith({
        activePeer: peers.data,
        secondPassphrase: 'sample passphrase',
        account,
      });
    });
  });

  describe('Not authenticated', () => {
    it('Should mount an Authenticate component is no passphrase provided', () => {
      const prop = {
        account,
        peers,
        registerSecondPassphrase: spy(),
        t: key => key,
      };

      wrapper = mount(<SecondPassphrase {...prop} />, options);
      expect(wrapper.find('Authenticate')).to.have.length(1);
    });
  });
});
