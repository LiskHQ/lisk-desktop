// import React from 'react';
// import { shallow } from 'enzyme';
// import Dialog from './dialog';
// import DialogHolder from './holder';

// jest.mock('./holder');

// describe('Dialog component', () => {
//   it.skip('Should render without close button', () => {
//     const wrapper = shallow(<Dialog><Dialog.Title>Dummy Title</Dialog.Title></Dialog>);
//     expect(wrapper).not.toContainMatchingElement('.closeBtn');
//     expect(wrapper).toContainExactlyOneMatchingElement(Dialog.Title);
//   });

//   it.skip('Should render with close button and dismiss on click', () => {
//     const wrapper = shallow(<Dialog hasClose><Dialog.Title>Dummy Title</Dialog.Title></Dialog>);
//     wrapper.find('.closeBtn').simulate('click');
//     expect(DialogHolder.hideDialog).toBeCalled();
//   });
// });
