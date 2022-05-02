import React from 'react';
import { mount } from 'enzyme';
import accounts from '@tests/constants/wallets';
import Row, { RowContext } from '.';

const avatarSize = 40;
const activeToken = 'LSK';
const currentBlockHeight = 14000000;

describe('Transaction Row', () => {
  // const t = str => str;
  const host = accounts.genesis.summary.address;
  const transfer = {};
  // const props = {
  //   t,
  //   host,
  //   layout,
  //   avatarSize,
  //   activeToken,
  //   currentBlockHeight,
  // };
  const contextData = {
    currentBlockHeight,
    data: transfer,
    host,
    activeToken,
    avatarSize,
  };
  it.skip('Should render the transaction summary in full layout mode', () => {
    const wrapper = mount(
      <RowContext.Provider value={contextData}>
        <Row />
      </RowContext.Provider>,
    );
    expect(wrapper).toBe(true);
  });
});
