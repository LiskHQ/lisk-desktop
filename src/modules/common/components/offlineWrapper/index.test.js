import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import OfflineWrapper from './offlineWrapper';
import styles from './offlineWrapper.css';

describe('OfflineWrapper', () => {
  it('renders props.children inside a span with "offline" class if props.offline', () => {
    const wrapper = shallow(
      <OfflineWrapper offline>
        <h1 />
      </OfflineWrapper>
    );
    expect(wrapper).to.contain(<h1 />);
    expect(wrapper).to.have.className(styles.isOffline);
  });

  it('renders without "offline" class if props.offline', () => {
    const wrapper = shallow(
      <OfflineWrapper offline={false}>
        <h1 />
      </OfflineWrapper>
    );
    expect(wrapper).not.to.have.className(styles.isOffline);
  });
});
