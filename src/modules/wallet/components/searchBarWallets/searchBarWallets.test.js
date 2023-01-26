import React from 'react';
import { mount } from 'enzyme';
import SearchBarWallets from './index';

describe('SearchBarWallets', () => {
  let wrapper;

  const props = {
    t: v => v,
    wallets: [],
    onSelectedRow: jest.fn(),
    rowItemIndex: 0,
    updateRowItemIndex: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<SearchBarWallets {...props} />);
  });

  it('should render properly empty accounts', () => {
    expect(wrapper).toContainMatchingElement('.accounts');
    expect(wrapper).toContainMatchingElement('.accounts-header');
    expect(wrapper).toContainMatchingElement('.account-content');
    expect(wrapper).not.toContainMatchingElement('.account-row');
  });

  it('should render properly delegate accounts', () => {
    const newProps = { ...props };
    newProps.wallets = [
      {
        address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99',
        balance: '120',
        isValidator: true,
        name: 'genesis_51',
        rank: 34,
      },
    ];
    wrapper = mount(<SearchBarWallets {...newProps} />);
    expect(wrapper).toContainMatchingElement('.accounts');
    expect(wrapper).toContainMatchingElement('.accounts-header');
    expect(wrapper).toContainMatchingElement('.account-content');
  });

  it('should render properly with accounts data', () => {
    const newProps = { ...props };
    newProps.wallets = [
      {
        address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99',
        balance: '120',
      },
      {
        address: 'lskyau2yy4993jkbd7kxcsfsrarac8macbbs8saad',
        balance: '110',
      },
    ];
    wrapper = mount(<SearchBarWallets {...newProps} />);

    expect(wrapper).toContainMatchingElement('.accounts');
    expect(wrapper).toContainMatchingElement('.accounts-header');
    expect(wrapper).toContainMatchingElement('.account-content');
    expect(wrapper).toContainMatchingElement('.account-row');
  });

  it('should call onClick function on selected row', () => {
    const newProps = { ...props };
    newProps.wallets = [
      {
        address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99',
        balance: '120',
      },
    ];
    wrapper = mount(<SearchBarWallets {...newProps} />);

    wrapper.find('.account-row').at(0).simulate('click');
    expect(props.onSelectedRow).toBeCalled();
  });
});
