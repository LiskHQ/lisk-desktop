import { mountWithRouter } from 'src/utils/testHelpers';
import * as searchParams from 'src/utils/searchParams';
import ConnectionStatus from './ConnectionStatus';

jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  createSignClient: jest.fn(() => Promise.resolve()),
  client: {
    pair: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: (str, values = {}) => {
      if (!values) return str;
      return Object.keys(values).reduce(
        (acc, curr) => acc.replace(`{{${curr}}}`, values[curr]),
        str
      );
    },
  })),
}));

describe('ConnectionStatus', () => {
  const props = {
    history: {
      push: jest.fn(),
      location: {
        pathname: 'localhost:8080/',
        search: '?modal=connection',
      },
    },
  };
  jest.spyOn(searchParams, 'removeSearchParamsFromUrl');

  it('Shows a message if events are not ready yet', () => {
    const wrapper = mountWithRouter(ConnectionStatus, props);
    expect(wrapper.find('h6').text()).toEqual(
      'Encountered an error while connecting to web app application.'
    );
  });

  it('Should mount correctly', () => {
    const specProps = {
      history: {
        ...props.history,
        location: {
          ...props.history.location,
          search: '?modal=connection&status=SUCCESS&name=web app&action=APPROVE',
        },
      },
    };

    // successfully approved
    let wrapper = mountWithRouter(ConnectionStatus, specProps);
    expect(wrapper.find('h3').text()).toBe('web app');
    expect(wrapper.find('h6').text()).toBe('Successfully paired with web app');

    // failed to approve
    specProps.history.location.search =
      '?modal=connection&status=FAILURE&name=web app&action=APPROVE';
    wrapper = mountWithRouter(ConnectionStatus, specProps);
    expect(wrapper.find('h6').text()).toBe('Failed to pair with web app');

    // successfully rejected
    specProps.history.location.search =
      '?modal=connection&status=SUCCESS&name=web app&action=REJECT';
    wrapper = mountWithRouter(ConnectionStatus, specProps);
    expect(wrapper.find('h6').text()).toBe('Rejected the pairing request from web app');

    // failed to reject
    specProps.history.location.search =
      '?modal=connection&status=FAILURE&name=web app&action=REJECT';
    wrapper = mountWithRouter(ConnectionStatus, specProps);
    expect(wrapper.find('h6').text()).toBe(
      'An error occurred while rejecting the pairing request from web app'
    );

    jest.runAllTimers();
    expect(searchParams.removeSearchParamsFromUrl).toHaveBeenCalled();
  });

  it('Should redirect to wallet', () => {
    const newProps = {
      history: {
        ...props.history,
        location: {
          ...props.history.location,
          search: '?modal=connection&status=SUCCESS&name=web app&action=APPROVE',
        },
      },
    };
    mountWithRouter(ConnectionStatus, newProps);
    jest.runAllTimers();
    expect(searchParams.removeSearchParamsFromUrl).toHaveBeenCalled();
    expect(props.history.push).toHaveBeenCalledWith(props.history.location.pathname);
  });
});
