import Transactions from './transactions';
import { mountWithProps } from '../../../utils/testHelpers';

describe('Transactions', () => {
  const props = {
    t: v => v,
    transactions: [
      {
        asset: {
          data: 'testing',
        },
        id: 123,
        type: 0,
      },
    ],
    onSelectedRow: jest.fn(),
    rowItemIndex: 0,
    updateRowItemIndex: jest.fn(),
  };
  const store = {
    network: {
      networks: {
        LSK: {
          apiVersion: 2,
        },
      },
    },
  };

  it('should render properly empty transactions', () => {
    const wrapper = mountWithProps(
      Transactions,
      props,
      store,
    );
    expect(wrapper).toContainMatchingElement('.transactions');
    expect(wrapper).toContainMatchingElement('.transactions-header');
    expect(wrapper).toContainMatchingElement('.transactions-subtitle');
    expect(wrapper).toContainMatchingElement('.transactions-content');
    expect(wrapper).toContainMatchingElement('.search-transaction-row');
  });

  it('should render properly with transactions data', () => {
    const newProps = { ...props };
    newProps.transactions = [
      {
        asset: {
          data: 'testing',
        },
        id: 123,
        type: 0,
      },
    ];
    const wrapper = mountWithProps(
      Transactions,
      newProps,
      store,
    );

    expect(wrapper).toContainMatchingElement('.transactions');
    expect(wrapper).toContainMatchingElement('.transactions-header');
    expect(wrapper).toContainMatchingElement('.transactions-subtitle');
    expect(wrapper).toContainMatchingElement('.transactions-content');
    expect(wrapper).toContainMatchingElement('.search-transaction-row');
  });

  it('should render properly with transactions data type 2', () => {
    const newProps = { ...props };
    newProps.transactions = [
      {
        asset: {
          data: 'testing',
        },
        id: 123,
        type: 2,
      },
    ];
    const wrapper = mountWithProps(
      Transactions,
      newProps,
      store,
    );

    expect(wrapper).toContainMatchingElement('.transactions');
    expect(wrapper).toContainMatchingElement('.transactions-header');
    expect(wrapper).toContainMatchingElement('.transactions-subtitle');
    expect(wrapper).toContainMatchingElement('.transactions-content');
    expect(wrapper).toContainMatchingElement('.search-transaction-row');
  });

  it('should render properly with transactions data type 3', () => {
    const newProps = { ...props };
    newProps.transactions = [
      {
        asset: {
          data: 'testing',
        },
        id: 123,
        type: 3,
      },
    ];
    const wrapper = mountWithProps(
      Transactions,
      newProps,
      store,
    );

    expect(wrapper).toContainMatchingElement('.transactions');
    expect(wrapper).toContainMatchingElement('.transactions-header');
    expect(wrapper).toContainMatchingElement('.transactions-subtitle');
    expect(wrapper).toContainMatchingElement('.transactions-content');
    expect(wrapper).toContainMatchingElement('.search-transaction-row');
  });

  it('should render properly with transactions data type 7', () => {
    const newProps = { ...props };
    newProps.transactions = [
      {
        asset: {
          data: 'testing',
        },
        id: 123,
        type: 7,
      },
    ];
    const wrapper = mountWithProps(
      Transactions,
      newProps,
      store,
    );

    expect(wrapper).toContainMatchingElement('.transactions');
    expect(wrapper).toContainMatchingElement('.transactions-header');
    expect(wrapper).toContainMatchingElement('.transactions-subtitle');
    expect(wrapper).toContainMatchingElement('.transactions-content');
    expect(wrapper).toContainMatchingElement('.search-transaction-row');
  });

  it('should call onClick function on selected row', () => {
    const newProps = { ...props };
    newProps.transactions = [
      {
        asset: {
          data: 'testing',
        },
        id: 123,
        type: 1,
      },
    ];
    const wrapper = mountWithProps(
      Transactions,
      newProps,
      store,
    );

    wrapper.find('.search-transaction-row').at(0).simulate('click');
    expect(props.onSelectedRow).toBeCalled();
  });
});
