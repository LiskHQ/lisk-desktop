import React from 'react';
import { expect } from 'chai';
import { spy, useFakeTimers } from 'sinon';
import { mount } from 'enzyme';
import MovableShape from './movableShape';
import styles from './create.css';

describe('MovableShape', () => {
  const props = {
    zIndex: 3,
    percentage: 0,
    className: styles.circle,
    initial: ['98%', '1%'],
    idBg: '123',
    idFg: '456',
    group: <g></g>,
    backGroundIndex: 1,
    foreGroundIndex: 2,
    width: '80',
    height: '80',
  };

  let clock;
  beforeEach(() => {
    spy(MovableShape.prototype, 'moveShape');
    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
  });

  afterEach(() => {
    MovableShape.prototype.moveShape.restore();
    clock.restore();
  });

  it('contains correct class name on element', () => {
    const wrapper = mount(<MovableShape {...props} />);
    expect(wrapper.find('div').props().className).to.contain(styles.circle);
  });

  it('sets the correct z-index of element', () => {
    const wrapper = mount(<MovableShape {...props} />);
    expect(wrapper.find('div').props().style.zIndex).to.be.equal(3);
  });

  it('assigns the initial state from the positions', () => {
    const initial = ['10%', '70%'];
    const rightProps = Object.assign({}, props, { initial });
    const wrapper = mount(<MovableShape {...rightProps} />);
    expect(wrapper.find('div').props().style.left).to.be.equal(initial[0]);
    expect(wrapper.find('div').props().style.bottom).to.be.equal(initial[1]);
  });

  it('moves when percentage increased', () => {
    const wrapper = mount(<MovableShape {...props} />);
    const initialLeft = wrapper.find('div').props().style.left;
    wrapper.setProps({ percentage: 1 });
    clock.tick(300);
    wrapper.update();
    expect(wrapper.find('div').props().style.left).to.be.equal(initialLeft);
  });
});

