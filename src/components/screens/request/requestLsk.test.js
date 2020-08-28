import React from 'react';
import { mountWithRouter } from '../../../utils/testHelpers';
import Request from './requestLsk';
import accounts from '../../../../test/constants/accounts';

jest.mock('../../shared/converter', () => (
  function ConverterMock() {
    return <span className="converted-price" />;
  }
));

describe('RequestLsk', () => {
  let wrapper;

  const props = {
    address: accounts.genesis.address,
    t: v => v,
  };

  beforeEach(() => {
    wrapper = mountWithRouter(Request, props);
  });

  it('Should update share link with amount and reference', () => {
    const shareLink = `lisk://wallet/send?recipient=${props.address}`;
    let evt;
    expect(wrapper.find(Request).state('shareLink')).toMatch(shareLink);

    evt = { target: { name: 'reference', value: 'test' } };
    wrapper.find('.fieldGroup').at(1).find('AutoResizeTextarea').simulate('change', evt);
    expect(wrapper.find(Request).state('shareLink')).toMatch(`${shareLink}&${evt.target.name}=${evt.target.value}`);


    evt = { target: { name: 'amount', value: 1 } };
    wrapper.find('.fieldGroup').at(0).find('input').simulate('change', evt);
    expect(wrapper.find(Request).state('shareLink')).toMatch(`${shareLink}&${evt.target.name}=${evt.target.value}`);
  });
});
