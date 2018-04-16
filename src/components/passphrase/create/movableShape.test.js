import React from 'react';
import { expect } from 'chai';
import { spy, useFakeTimers } from 'sinon';
import { mount } from 'enzyme';
import MovableShape from './movableShape';
import styles from './create.css';

describe('MovableShape', () => {
  const props = {
    hidden: 1,
    percentage: 0,
    className: styles.circle,
    initial: ['98%', '1%'],
    idBg: '123',
    idFg: '123',
    group: <g></g>,
    backGroundIndex: 1,
    foreGroundIndex: 2,
    width: '80px',
    height: '82px',
    viewBox: '0 0 80 82',
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

  it("when props.hidden is equal to '1' opacity of element should be equal '1'", () => {
    const wrapper = mount(<MovableShape {...props} />);
    expect(wrapper.find('div').props().style.opacity).to.be.equal(1);
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

  it('should not render if hidden is 0', () => {
    const hiddenProps = Object.assign({}, props, { hidden: 0 });
    const wrapper = mount(<MovableShape {...hiddenProps} />);
    const initialLeft = wrapper.find('div').props().style.left;
    wrapper.setProps({ percentage: 1 });
    wrapper.update();
    clock.tick(300);
    wrapper.update();
    expect(wrapper.find('div').props().style.left).to.be.equal(initialLeft);
  });
});

