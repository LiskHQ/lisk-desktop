import React from 'react';
import { mount } from 'enzyme';
import DialogHolder from './holder';
import Dialog from './dialog';

describe('Dialog Holder Component', () => {
  let wrapper;
  const DummyDialog = (
    <Dialog hasClose>
      <Dialog.Title>Dummy text</Dialog.Title>
      <Dialog.Options>
        <button className="dummy-option">Option</button>
      </Dialog.Options>
    </Dialog>
  );

  beforeEach(() => {
    wrapper = mount(<DialogHolder />);
  });

  it('Should render empty DialogHolder and add dialog when showDialog is called', () => {
    expect(wrapper).toBeEmptyRender();
    expect(DialogHolder.showDialog(DummyDialog)).toEqual(true);
    wrapper.update();
    expect(wrapper).toContainExactlyOneMatchingElement('Dialog');
  });

  it('Should dismiss dialog and remove from holder if closeBtn or option clicked', () => {
    DialogHolder.showDialog(DummyDialog);
    wrapper.update();
    wrapper.find('.closeBtn').at(0).simulate('click');
    wrapper.update();
    expect(wrapper).toBeEmptyRender();

    DialogHolder.showDialog(DummyDialog);
    wrapper.update();
    wrapper.find('.dummy-option').simulate('click');
    wrapper.update();
    expect(wrapper).toBeEmptyRender();
  });

  it('Should not render dialog with invalid React element', () => {
    expect(wrapper).toBeEmptyRender();
    expect(DialogHolder.showDialog(jest.fn())).toBe(false);
    wrapper.update();
    expect(wrapper).toBeEmptyRender();
  });
});
