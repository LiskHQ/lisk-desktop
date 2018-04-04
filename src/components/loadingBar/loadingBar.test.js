import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import LoadingBar from './loadingBar';


describe('LoadingBar Container', () => {
  let clock;
  const props = {
    loading: [],
    markAsLoaded: sinon.spy(),
    peers: {},
  };

  beforeEach(() => {
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
  });

  afterEach(() => {
    clock.tick(10000);
    clock.restore();
  });

  it('should show ProgresBar if props.loading.length is changed not to be 0', () => {
    const wrapper = mount(<LoadingBar {...props} />);
    wrapper.setProps({ loading: ['test'] });
    expect(wrapper.find('ProgressBar')).to.be.present();
  });

  it('should not show ProgressBar if props.loading.length is 0', () => {
    const wrapper = mount(<LoadingBar {...props} />);
    expect(wrapper.find('ProgressBar')).not.to.be.present();
  });

  it('should hide ProgresBar after 1 second if props.loading.length is changed to be 0', () => {
    const wrapper = mount(<LoadingBar {...props} />);
    expect(wrapper.find('ProgressBar')).not.to.be.present();
    wrapper.setProps({ loading: ['test'] });
    expect(wrapper.find('ProgressBar')).to.be.present();
    wrapper.setProps({ loading: ['test', 'test2'] });
    expect(wrapper.find('ProgressBar')).to.be.present();
    clock.tick(200);
    wrapper.setProps({ loading: [] });
    expect(wrapper.find('ProgressBar')).to.be.present();
    clock.tick(200);
    expect(wrapper.find('ProgressBar')).to.be.present();
    clock.tick(650);
    wrapper.update();
    expect(wrapper.find('ProgressBar')).not.to.be.present();
  });

  it('should call markAsLoaded after peer is set', () => {
    const wrapper = mount(<LoadingBar {...props} />);
    expect(props.markAsLoaded).to.not.have.been.calledWith();
    wrapper.setProps({ peers: { data: {} } });
    expect(props.markAsLoaded).to.have.been.calledWith();
  });
});
