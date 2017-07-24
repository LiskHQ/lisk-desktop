import React from 'react';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { Dialog } from 'react-toolbox/lib/dialog';
import DialogElement from '../dialog/dialogElement';

chai.use(chaiEnzyme()); // Note the invocation at the end
describe('DialogElement', () => {
  let wrapper;
  const Dummy = props => (<div>DUMMY {props.name}</div>);
  const dialogProps = {
    title: 'Original title',
    childComponentProps: {
      name: 'Original name',
    },
    childComponent: Dummy,
  };

  beforeEach(() => {
    wrapper = shallow(<DialogElement dialog={dialogProps} onCancelClick={() => {}}/>);
  });

  it('renders <Dialog /> component from react-toolbox', () => {
    expect(wrapper.find(Dialog)).to.have.length(1);
  });

  it('renders component passed in props.dialog.childComponent', () => {
    wrapper = shallow(<DialogElement dialog={{ childComponent: Dummy }} onCancelClick={() => {}}/>);
    expect(wrapper.find(Dummy)).to.have.length(1);
  });

  it('does not render a child component if none passed in props.dialog.childComponent', () => {
    wrapper = shallow(<DialogElement dialog={{}} />);
    expect(wrapper.find(Dummy)).to.have.length(0);
  });

  it('allows to close the dialog', () => {
    const clock = sinon.useFakeTimers();
    wrapper.find('.x-button').simulate('click');
    expect(wrapper.state('hidden')).to.equal(true);
    clock.tick(510);
    expect(wrapper.state('hidden')).to.equal(false);
    clock.restore();
  });
});
