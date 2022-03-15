import { toast } from 'react-toastify';
import FlashMessageHolder from '@toolbox/flashMessage/holder';
import { mountWithRouter } from '@utils/testHelpers';
import AnalyticsDialog from './analyticsDialog';

jest.mock('@toolbox/flashMessage/holder');
jest.mock('@toolbox/dialog/holder');

describe('Analytics dialog component', () => {
  const props = {
    settings: {
      statictics: false,
    },
    settingsUpdated: jest.fn(),
    t: v => v,
  };
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render with Opt-in (Analytics) message and call FlashMessageHolder.deleteMessage on cancel click', () => {
    wrapper = mountWithRouter(AnalyticsDialog, props);
    expect(wrapper).toIncludeText('Anonymous data collection');
    expect(wrapper).toIncludeText('Privacy policy');
    wrapper.find('button').first().simulate('click');
    expect(FlashMessageHolder.deleteMessage).toBeCalledTimes(1);
  });

  it('Should render with Opt-in (Analytics) message and call FlashMessageHolder.deleteMessage on accept click', () => {
    jest.spyOn(toast, 'info');
    wrapper = mountWithRouter(AnalyticsDialog, props);
    wrapper.find('button').last().simulate('click');
    expect(FlashMessageHolder.deleteMessage).toBeCalledTimes(1);
    expect(props.settingsUpdated).toBeCalled();
    expect(toast.info).toBeCalled();
  });
});
