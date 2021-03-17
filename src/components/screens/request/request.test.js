import React from 'react';
import { tokenMap } from '@constants';
import { mountWithRouter } from '../../../utils/testHelpers';
import Request from '.';
import accounts from '../../../../test/constants/accounts';

jest.mock('../../shared/converter', () => (
  function ConverterMock() {
    return <span className="converted-price" />;
  }
));

describe('Request', () => {
  let wrapper;

  const props = {
    account: {
      info: {
        LSK: {
          address: accounts.genesis.address,
        },
        BTC: {
          address: '16Qp9op3fTESTBTCACCOUNTv52ghRzYreUuQ',
        },
      },
    },
    token: tokenMap.LSK.key,
    t: v => v,
    history: {
      push: jest.fn(),
      location: {
        pathname: 'wallet',
        search: '?modal=request',
      },
    },
  };

  beforeEach(() => {
    wrapper = mountWithRouter(Request, props, props.history.location);
  });

  describe('Amount field', () => {
    it('Should show converter', () => {
      expect(wrapper.find('.amount .converted-price')).toExist();
    });

    it('Should add leading 0 if . is inserted as first character', () => {
      const evt = { target: { name: 'amount', value: '.1' } };
      wrapper.find('.fieldGroup input').simulate('change', evt);
      wrapper.update();
      expect(wrapper.find('.fieldGroup input').props().value).toEqual('0.1');
    });

    it('Should show error feedback if letters inserted', () => {
      const evt = { target: { name: 'amount', value: 'abc' } };
      expect(wrapper.find('.amount Feedback')).toHaveText('');
      wrapper.find('.fieldGroup input').simulate('change', evt);
      wrapper.update();
      expect(wrapper.find('.amount Feedback')).toHaveText('Provide a correct amount of LSK');
    });

    it('Should show error feedback if ending in . or multiples .', () => {
      const evt = { target: { name: 'amount', value: 1 } };
      const multipleDotsEvt = { target: { name: 'amount', value: '1.2.3' } };
      const endingDotEvt = { target: { name: 'amount', value: '12.' } };
      const amountField = wrapper.find('.fieldGroup').at(0);
      amountField.find('input').simulate('change', endingDotEvt);
      wrapper.update();
      expect(wrapper.find('.amount Feedback')).toHaveText('Provide a correct amount of LSK');
      amountField.find('input').simulate('change', evt);
      wrapper.update();
      expect(wrapper.find('.amount Feedback')).toHaveText('');
      amountField.find('input').simulate('change', multipleDotsEvt);
      wrapper.update();
      expect(wrapper.find('.amount Feedback')).toHaveText('Provide a correct amount of LSK');
    });
  });

  describe('Reference field', () => {
    it('Should show feedback if some text inserted and hide if empty', () => {
      const referenceField = wrapper.find('.fieldGroup').at(1);
      let evt = { target: { name: 'reference', value: 'test' } };
      expect(wrapper.find('.fieldGroup .feedback.show')).not.toExist();
      referenceField.find('AutoResizeTextarea').simulate('change', evt);
      wrapper.update();
      expect(wrapper.find('.fieldGroup .feedback')).toExist();
      expect(wrapper.find('.fieldGroup .feedback.error')).not.toExist();

      evt = { target: { name: 'reference', value: '' } };
      referenceField.find('AutoResizeTextarea').simulate('change', evt);
      wrapper.update();
      expect(wrapper.find('.fieldGroup .feedback.show')).not.toExist();
    });

    it('Should show error feedback over limit of characters', () => {
      const referenceField = wrapper.find('.fieldGroup').at(1);
      const evt = {
        target: {
          name: 'reference',
          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit volutpat.',
        },
      };
      referenceField.find('AutoResizeTextarea').simulate('change', evt);
      wrapper.update();
      expect(wrapper.find('.fieldGroup .feedback')).toExist();
      expect(wrapper.find('.fieldGroup .feedback.error')).toExist();
    });
  });

  describe('Share Link', () => {
    it('Should copy and set timeout on click', () => {
      expect(wrapper.find('.copy-button button')).not.toBeDisabled();
      wrapper.find('.copy-button button').simulate('click');
      expect(wrapper.find('.copy-button button')).toBeDisabled();
      jest.advanceTimersByTime(3100);
      wrapper.update();
      expect(wrapper.find('.copy-button button')).not.toBeDisabled();
    });

    it('Should render BTC request if props.token is BTC', () => {
      wrapper = mountWithRouter(Request, { ...props, token: 'BTC' }, props.history.location);
      expect(wrapper.find('.copy-button button').text()).toMatch('Copy address');
    });
  });
});
