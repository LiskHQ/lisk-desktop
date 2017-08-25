import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import OfflineWrapperHOC, { OfflineWrapperComponent } from './index';
import styles from './offlineWrapper.css';

const fakeStore = configureStore();

describe('OfflineWrapper', () => {
  it('renders props.children inside a span with "offline" class if props.offline', () => {
    const wrapper = shallow(
      <OfflineWrapperComponent offline={true}><h1 /> </OfflineWrapperComponent>);
    expect(wrapper).to.contain(<h1 />);
    expect(wrapper).to.have.className(styles.isOffline);
  });

  it('renders without "offline" class if props.offline', () => {
    const wrapper = shallow(
      <OfflineWrapperComponent offline={false}><h1 /> </OfflineWrapperComponent>);
    expect(wrapper).not.to.have.className(styles.isOffline);
  });
});

describe('OfflineWrapperHOC', () => {
  it('should set props.offline = false if "offline" is not in store.loading', () => {
    const store = fakeStore({
      loading: [],
    });
    const wrapper = mount(<Provider store={store}><OfflineWrapperHOC /></Provider>);
    expect(wrapper.find(OfflineWrapperComponent).props().offline).to.equal(false);
  });

  it('should set props.offline = true if "offline" is in store.loading', () => {
    const store = fakeStore({
      loading: ['offline'],
    });
    const wrapper = mount(<Provider store={store}><OfflineWrapperHOC /></Provider>);
    expect(wrapper.find(OfflineWrapperComponent).props().offline).to.equal(true);
  });
});
