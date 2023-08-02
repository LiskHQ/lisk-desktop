import { mountWithCustomRouter } from 'src/utils/testHelpers';
import AnalyticsMessage from './analyticsMessage';

describe('Analytics Message banner', () => {
  let wrapper;
  const pushMock = jest.fn();
  const props = {
    t: (v) => v,
    history: {
      push: pushMock,
      location: { search: '', path: '' },
    },
  };

  beforeEach(() => {
    wrapper = mountWithCustomRouter(AnalyticsMessage, props);
  });

  it('Should render correctly with all passed props', () => {
    expect(wrapper).toIncludeText('Opt-in to sharing anonymous data in order to improve Lisk.');
    expect(wrapper).toIncludeText('Read more');
    wrapper.find('a.url-link').simulate('click');
    expect(pushMock).toHaveBeenCalledTimes(1);
  });
});
