// import React from 'react';
// import { mount } from 'enzyme';
// import NewReleaseDialog from './newReleaseDialog';
// import FlashMessageHolder from '../../toolbox/flashMessage/holder';
// import DialogHolder from '../../toolbox/dialog/holder';

// jest.mock('../../toolbox/flashMessage/holder');
// jest.mock('../../toolbox/dialog/holder');

// describe('New release dialog component', () => {
//   const props = {
//     version: '1.20.1',
//     releaseNotes: <div><p>Dummy text</p></div>,
//     ipc: {
//       send: jest.fn(),
//     },
//     t: v => v,
//   };
//   let wrapper;

//   beforeEach(() => {
//     wrapper = mount(<NewReleaseDialog {...props} />);
//   });

//   it.skip('Should render with release notes and call FlashMessageHolder.deleteMessage on any option click', () => {
//     expect(wrapper).toContainReact(props.releaseNotes);
//     wrapper.find('button').first().simulate('click');
//     expect(FlashMessageHolder.deleteMessage).toBeCalledTimes(1);
//     wrapper.find('button').last().simulate('click');
//     expect(FlashMessageHolder.deleteMessage).toBeCalledTimes(2);
//     expect(props.ipc.send).toBeCalled();
//     expect(DialogHolder.hideDialog).toBeCalledTimes(2);
//   });
// });
