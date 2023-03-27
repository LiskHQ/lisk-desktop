import React from 'react';
import { mountWithRouterAndStore } from 'src/utils/testHelpers';
import NewReleaseDialog from './index';

jest.mock('src/theme/flashMessage/holder');
jest.mock('src/theme/dialog/holder');
jest.mock('src/utils/searchParams', () => ({
  removeSearchParamsFromUrl: jest.fn(),
}));

describe('New release dialog component', () => {
  const remindMeLater = jest.fn();
  const updateNow = jest.fn();
  const props = { t: (v) => v };
  const store = {
    appUpdates: {
      version: '1.20.1',
      releaseNotes: '<div><p>Dummy text</p></div>',
      remindMeLater,
      updateNow,
    },
  };

  it('Should render all remindMeLater and updateNow', () => {
    const wrapper = mountWithRouterAndStore(NewReleaseDialog, props, {}, store);
    wrapper.find('button.release-dialog-remind-me-later').at(0).simulate('click');
    expect(remindMeLater).toBeCalledTimes(1);
    wrapper.find('button.release-dialog-update-now').at(0).simulate('click');
    expect(updateNow).toBeCalledTimes(1);
  });

  it('Should display release notes', () => {
    let wrapper = mountWithRouterAndStore(NewReleaseDialog, props, {}, store);
    expect(wrapper.find('.release-notes').at(0)).toHaveText('Dummy text');

    store.appUpdates.releaseNotes = (
      <div>
        <p>ReactDummy text</p>
      </div>
    );
    wrapper = mountWithRouterAndStore(NewReleaseDialog, props, {}, store);
    expect(wrapper.find('.release-notes').at(0)).toHaveText('ReactDummy text');
  });
});
