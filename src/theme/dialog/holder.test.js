import React from 'react';
import { useSelector } from 'react-redux';
import { mount } from 'enzyme';
import mockSavedAccounts from '@tests/fixtures/accounts';
import DialogHolder from './holder';
import MockDialog from './dialog';

const mockHistory = {
  location: { pathname: '/', search: '' },
  push: jest.fn(),
};

jest.mock('src/routes/routes', () => ({
  modals: {
    testDialog: {
      forbiddenTokens: [],
    },
  },
}));

jest.mock('src/routes/routesMap', () => {
  const component = () => <MockDialog.WrappedComponent hasClose history={mockHistory} />;
  return { testDialog: component };
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('Dialog Holder Component', () => {
  const mockAppState = {
    account: {
      current: mockSavedAccounts[0],
    },
    token: {
      active: 'LSK',
    },
    wallet: {
      info: {
        LSK: 'some data',
      },
    },
    network: {
      name: 'testnet',
      serviceUrl: 'someUrl',
    },
    staking: {},
  };

  afterEach(() => {
    mockHistory.push.mockClear();
    useSelector.mockClear();
  });

  let wrapper;

  beforeEach(() => {
    useSelector.mockImplementation((callback) => callback(mockAppState));
    wrapper = mount(<DialogHolder.WrappedComponent history={mockHistory} />);
  });

  it('Should render empty DialogHolder and add dialog when showDialog is called', () => {
    expect(wrapper).toBeEmptyRender();
    const newHistory = {
      ...mockHistory,
      location: { search: '?modal=testDialog' },
    };

    wrapper.setProps({ history: newHistory });
    expect(wrapper).toContainExactlyOneMatchingElement('Dialog');
  });

  it('Should dismiss dialog and remove from holder if closeBtn clicked', () => {
    expect(wrapper).toBeEmptyRender();
    const newHistory = {
      ...mockHistory,
      location: { search: '?modal=testDialog' },
    };

    wrapper.setProps({ history: newHistory });
    expect(wrapper).toContainExactlyOneMatchingElement('Dialog');
    wrapper.find('.closeBtn').at(0).simulate('click');

    expect(mockHistory.push).toHaveBeenCalledTimes(1);
    expect(mockHistory.push).toHaveBeenCalledWith(mockHistory.location.pathname);
  });
});
