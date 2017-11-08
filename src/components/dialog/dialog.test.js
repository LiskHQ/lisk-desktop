import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Dialog as ReactToolboxDialog } from 'react-toolbox/lib/dialog';
import Dialog from './dialog';
import Send from '../send';

describe('Dialog', () => {
  let wrapper;
  const history = {
    location: {
      pathname: '/main/transactions/send',
      search: '',
    },
    push: sinon.spy(),
  };
  const dialogProps = {
    title: 'Send',
    childComponentProps: {
      name: 'send',
    },
    childComponent: Send,
  };

  const props = {
    dialogDisplayed: () => {},
    t: key => key,
  };

  beforeEach(() => {
    wrapper = shallow(<Dialog dialog={dialogProps} history={history} {...props}/>);
  });

  it('renders Dialog component from react-toolbox', () => {
    expect(wrapper.find(ReactToolboxDialog)).to.have.length(1);
  });

  it('renders a child component based on the path defined in history', () => {
    expect(wrapper.find(Send)).to.have.length(1);
  });

  it('allows to close the dialog', () => {
    wrapper.find('.x-button').simulate('click');
    expect(history.push).to.have.been.calledWith();
  });

  it('should fix the route if there are two dialog names', () => {
    const newProps = Object.assign({}, { dialog: dialogProps, history }, props);
    newProps.dialog.title = 'Send1';
    // trying to update the component
    wrapper.setProps(newProps);
    expect(history.push).to.have.been.calledWith();
  });
});
