import React from 'react';
import { expect } from 'chai';
import { spy, useFakeTimers } from 'sinon';
import { mount } from 'enzyme';
import MovableShape from './movableShape';
import styles from './create.css';
// import * as shapesSrc from '../../assets/images/register-shapes/*.svg'; //eslint-disable-line

describe('MovableShape', () => {
  const props = {
    hidden: 1,
    src: 'test.svg',
    percentage: 0,
    className: styles.circle,
    initial: ['98%', '1%'],
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

  it('shows an img tag', () => {
    const wrapper = mount(<MovableShape {...props} />);
    expect(wrapper.find('img').props().src).to.be.equal('test.svg');
    expect(wrapper.find('img').props().className).to.be.equal(styles.circle);
  });

  it("when props.hidden is equal to '1' opacity of img should be equal '1'", () => {
    const wrapper = mount(<MovableShape {...props} />);
    expect(wrapper.find('img').props().style.opacity).to.be.equal(1);
  });

  it('assigns the initial state from the positions', () => {
    const initial = ['10%', '70%'];
    const rightProps = Object.assign({}, props, { initial });
    const wrapper = mount(<MovableShape {...rightProps} />);
    expect(wrapper.find('img').props().style.left).to.be.equal(initial[0]);
    expect(wrapper.find('img').props().style.bottom).to.be.equal(initial[1]);
  });
});

