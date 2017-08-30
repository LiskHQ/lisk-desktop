import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Dialog as ReactToolboxDialog } from 'react-toolbox/lib/dialog';
import Dialog from './dialog';

describe('Dialog', () => {
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
    wrapper = shallow(<Dialog dialog={dialogProps} onCancelClick={() => {}}/>);
  });

  it('renders <Dialog /> component from react-toolbox', () => {
    expect(wrapper.find(ReactToolboxDialog)).to.have.length(1);
  });

  it('renders component passed in props.dialog.childComponent', () => {
    wrapper = shallow(<Dialog dialog={{ childComponent: Dummy }} onCancelClick={() => {}}/>);
    expect(wrapper.find(Dummy)).to.have.length(1);
  });

  it('does not render a child component if none passed in props.dialog.childComponent', () => {
    wrapper = shallow(<Dialog dialog={{}} />);
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
