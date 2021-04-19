import { mountWithRouter } from '@utils/testHelpers';
import { addSearchParamsToUrl } from '../../../utils/searchParams';
import Reclaim from './reclaim';
import styles from './index.css';

jest.mock('../../../utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));

describe('Reclaim balance screen', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      t: v => v,
      history: {
        push: jest.fn(),
      },
    };
    wrapper = mountWithRouter(Reclaim, props);
  });

  it('Opens send modal', () => {
    wrapper.find(styles.button).first().simulate('click');
    expect(
      addSearchParamsToUrl,
    ).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ }),
      { modal: 'send', reclaim: true },
    );
  });
});
