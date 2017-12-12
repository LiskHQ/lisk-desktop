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
    end: { x: 550, y: 50 },
    reverse: true,
  };
  let clock;
  let wrapper;
  beforeEach(() => {
    spy(MovableShape.prototype, 'moveShape');
    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    wrapper = mount(<MovableShape {...props} />);
  });

  afterEach(() => {
    MovableShape.prototype.moveShape.restore();
    clock.restore();
  });

  it('shows an img tag', () => {
    expect(wrapper.find('img').props().src).to.be.equal('test.svg');
    expect(wrapper.find('img').props().className).to.be.equal(styles.circle);
  });

  it("When props.hidden is equal to '1' opacity of img should be equal '1'", () => {
    expect(wrapper.find('img').props().style.opacity).to.be.equal(1);
  });
});

