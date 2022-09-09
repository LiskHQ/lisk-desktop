import { mountWithRouter } from 'src/utils/testHelpers';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import Initialization from '.';
import styles from './initialization.css';

jest.mock('src/utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));
window.open = jest.fn();

describe('Initialization', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      t: (v) => v,
      history: {
        push: jest.fn(),
      },
    };
    wrapper = mountWithRouter(Initialization, props);
  });

  it('Opens send modal', () => {
    wrapper.find(styles.button).first().simulate('click');
    expect(addSearchParamsToUrl).toHaveBeenNthCalledWith(1, expect.objectContaining({}), {
      modal: 'send',
      initialization: true,
    });
  });

  it('Opens lisk blog windows', () => {
    wrapper.find('span').first().simulate('click');
    expect(window.open).toHaveBeenCalledWith(
      'https://lisk.com/blog/announcement/lisk-account-initialization',
      '_blank',
      'rel=noopener noreferrer'
    );
  });
});
