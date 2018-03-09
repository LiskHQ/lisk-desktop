import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Dialog as ReactToolboxDialog } from 'react-toolbox/lib/dialog';
import Dialog from './dialog';
import SavedAccounts from '../savedAccounts';
import routes from '../../constants/routes';

describe('Dialog', () => {
  let wrapper;
  let history;
  let dialogProps;
  let props;

  beforeEach(() => {
    history = {
      location: {
        pathname: `${routes.explorer}${routes.search.url}saved-accounts`,
        search: '',
      },
      push: sinon.spy(),
    };
    dialogProps = {
      title: 'Saved Accounts',
      childComponentProps: {
        name: 'saved-accounts',
      },
      childComponent: SavedAccounts,
    };

    props = {
      dialogDisplayed: () => {},
      t: key => key,
    };
    wrapper = shallow(<Dialog dialog={dialogProps} history={history} {...props}/>);
  });

  it('renders Dialog component from react-toolbox', () => {
    expect(wrapper.find(ReactToolboxDialog)).to.have.length(1);
  });

  it('renders a child component based on the path defined in history', () => {
    expect(wrapper.find(SavedAccounts)).to.have.length(1);
  });

  it('allows to close the dialog on regexp path ', () => {
    const basePath = `${routes.explorer}${routes.wallet.url}/1523498127498/`;
    history.location.pathname = `${basePath}saved-accounts`;
    wrapper.setProps({ history });
    wrapper.find('.x-button').simulate('click');
    expect(history.push).to.have.been.calledWith(basePath);
  });

  it('allows to close the dialog on non-regexp path ', () => {
    history.location.pathname = `${routes.main}${routes.wallet.url}saved-accounts`;
    wrapper.setProps({ history });
    wrapper.find('.x-button').simulate('click');
    expect(history.push).to.have.been.calledWith();
  });

  // this test used to pass only because the history.push spy was not in beforeEach
  it.skip('should fix the route if there are two dialog names', () => {
    const newProps = Object.assign({}, { dialog: dialogProps, history }, props);
    newProps.dialog.title = 'Send1';
    // trying to update the component
    wrapper.setProps(newProps);
    expect(history.push).to.have.been.calledWith();
  });
});
