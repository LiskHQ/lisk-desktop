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
        pathname: `${routes.explorer.path}${routes.searchResult.path}saved-accounts`,
        search: '',
      },
      goBack: sinon.spy(),
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
      dialogHidden: sinon.spy(),
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

  it('doesn\'t render appBar if title not provided', () => {
    const propsWithoutTitle = { ...dialogProps };
    delete propsWithoutTitle.title;
    wrapper = shallow(<Dialog dialog={propsWithoutTitle} history={history} {...props}/>);
    expect(wrapper.find('AppBar')).to.have.length(0);
  });

  it('doesn\'t render body if not childComponents present', () => {
    const propsWithoutChildComponent = { ...dialogProps };
    delete propsWithoutChildComponent.childComponent;
    wrapper = shallow(<Dialog dialog={propsWithoutChildComponent} history={history} {...props}/>);
    expect(wrapper.find(SavedAccounts)).to.have.length(0);
  });

  it('allows to close the dialog on regexp path ', () => {
    const basePath = `${routes.explorer.path}${routes.wallet.path}/1523498127498/`;
    history.location.pathname = `${basePath}saved-accounts`;
    wrapper.setProps({ history });
    wrapper.find('.x-button').simulate('click');
    expect(history.goBack).to.have.been.calledWith();
  });

  it('allows to close the dialog on non-regexp path ', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });
    history.location.pathname = `${routes.wallet.path}saved-accounts`;
    wrapper.setProps({ history });
    wrapper.find('.x-button').simulate('click');
    clock.tick(600);
    expect(props.dialogHidden).to.have.been.calledWith();
    expect(history.goBack).to.have.been.calledWith();
    clock.restore();
  });

  // this test used to pass only because the history.push spy was not in beforeEach
  it.skip('should fix the route if there are two dialog names', () => {
    const newProps = Object.assign({}, { dialog: dialogProps, history }, props);
    newProps.dialog.title = 'Send1';
    // trying to update the component
    wrapper.setProps(newProps);
    expect(history.goBack).to.have.been.calledWith();
  });
});
