import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import signedTransaction from '../../../../../test/fixtures/signedTx.json';
import Form from './form';

describe('Unlock LSK form', () => {
  let wrapper;

  const props = {
    t: str => str,
    nextStep: jest.fn(),
    data: {},
    signedTransaction: {},
    txSignatureError: null,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    wrapper = mount(<Form {...props} />);
  });

  it('calls nextStep when the transactions is successfully signed', async () => {
    wrapper.setProps({ signedTransaction });
    act(() => { wrapper.update(); });
    expect(props.nextStep).toBeCalledWith(
      expect.objectContaining({ transactionInfo: expect.any(Object) }),
    );
  });

  it('calls nextStep without tx details if failed to sign', async () => {
    wrapper.setProps({ txSignatureError: { message: 'some error' } });
    act(() => { wrapper.update(); });
    expect(props.nextStep).toBeCalledWith(
      expect.objectContaining({ fee: undefined }),
    );
  });
});
