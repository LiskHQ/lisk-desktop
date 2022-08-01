import React from 'react';
import { mountWithRouter } from 'src/utils/testHelpers';
import accounts from '@tests/constants/wallets';
import Request from './request';

jest.mock('src/modules/common/components/converter', () => (
  function ConverterMock() {
    return <span className="converted-price" />;
  }
));

describe('Request', () => {
  let wrapper;

  const props = {
    address: accounts.genesis.summary.address,
    t: v => v,
  };
  const routeConfig = {
    pathname: 'wallet',
    search: '?modal=request',
  };

  beforeEach(() => {
    wrapper = mountWithRouter(Request, props, routeConfig);
  });

  it('Should update share link with amount and reference', () => {
    const shareLink = `lisk://wallet/send?recipient=${props.address}`;
    let evt;
    expect(wrapper.find(Request).state('shareLink')).toMatch(shareLink);

    evt = { target: { name: 'reference', value: 'test' } };
    wrapper.find('.add-message-button').at(0).simulate('click');

    wrapper.find('label textarea[placeholder="Write message"]').simulate('change', evt);
    expect(wrapper.find(Request).state('shareLink')).toMatch(`${shareLink}&${evt.target.name}=${evt.target.value}`);

    evt = { target: { name: 'amount', value: 1 } };
    wrapper.find('.fieldGroup').at(2).find('input').simulate('change', evt);
    expect(wrapper.find(Request).state('shareLink')).toMatch(`${shareLink}&${evt.target.name}=${evt.target.value}`);

    expect(wrapper.find('.recipient-application').at(0)).toBeTruthy();
    expect(wrapper.find('.token').at(0)).toBeTruthy();
  });
});
