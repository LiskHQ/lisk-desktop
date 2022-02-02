import React from 'react';
import FlashMessageHolder from '@toolbox/flashMessage/holder';
import { mountWithRouter } from '@utils/testHelpers';
import { removeSearchParamsFromUrl } from '@utils/searchParams';
import NewReleaseDialog from './index';

jest.mock('@toolbox/flashMessage/holder');
jest.mock('@toolbox/dialog/holder');
jest.mock('@utils/searchParams', () => ({
  removeSearchParamsFromUrl: jest.fn(),
}));

describe('New release dialog component', () => {
  const props = {
    t: v => v,
    version: '1.20.1',
    releaseNotes: <div><p>Dummy text</p></div>,
    ipc: {
      send: jest.fn(),
    },
  };

  let wrapper;

  beforeEach(() => {
    wrapper = mountWithRouter(NewReleaseDialog, props);
  });

  it('Should render with release notes and call FlashMessageHolder.deleteMessage on any option click', () => {
    expect(wrapper).toContainReact(props.releaseNotes);
    wrapper.find('button').first().simulate('click');
    expect(FlashMessageHolder.deleteMessage).toBeCalledTimes(1);
    wrapper.find('button').last().simulate('click');
    expect(FlashMessageHolder.deleteMessage).toBeCalledTimes(2);
    expect(props.ipc.send).toBeCalled();
    expect(removeSearchParamsFromUrl).toBeCalledTimes(2);
  });
});
