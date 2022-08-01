import React from 'react';
import { mount } from 'enzyme';
import { tokenMap } from '@token/fungible/consts/tokens';
import i18n from 'src/utils/i18n/i18n';
import wallets from '@tests/constants/wallets';
import Summary from './Summary';

describe('Summary', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      resetTransactionResult: jest.fn(),
      prevStep: jest.fn(),
      nextStep: jest.fn(),
      token: tokenMap.LSK.key,
      rawTx: {
        params: {
          recipient: { address: wallets.genesis.summary.address },
          amount: 112300000,
          data: 'test',
        },
        moduleCommandID: '2:0',
      },
      t: i18n.t,
    };
    wrapper = mount(<Summary {...props} />);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('.summary');
    expect(wrapper).toContainMatchingElement('.summary-header');
    expect(wrapper).toContainMatchingElement('.summary-content');
    expect(wrapper).toContainMatchingElement('.summary-footer');
    expect(wrapper.find('button.confirm-button')).toHaveText('Send 1.123 LSK');
    expect(wrapper.find('.amount-summary')).toIncludeText('1.123 LSK');
  });

  it('should going to previous page', () => {
    wrapper.find('.cancel-button').at(0).simulate('click');
    wrapper.update();
    expect(props.prevStep).toBeCalled();
  });

  it('should going to previous page', () => {
    wrapper.find('.confirm-button').at(0).simulate('click');
    wrapper.update();
    expect(props.nextStep).toBeCalled();
  });

  it('should show props.fields.recipient.title if it is present', () => {
    const title = 'Custom title';
    wrapper = mount(<Summary {...{
      ...props,
      rawTx: {
        ...props.rawTx,
        params: {
          ...props.rawTx.params,
          recipient: {
            ...props.rawTx.params.recipient,
            title,
          },
        },
      },
    }}
    />);
    expect(wrapper.find('.recipient-value')).toIncludeText(props.rawTx.params.recipient.address);
    expect(wrapper.find('.recipient-value')).toIncludeText(title);
  });
});
