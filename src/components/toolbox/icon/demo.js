import React from 'react';
import Icon from './';
import DemoRenderer from '../demoRenderer';
import svgIcons from '../../../utils/svgIcons';
import styles from './demo.css';

const IconDemo = () => (
  <div className={styles.wrapper}>
    <h2>Icon</h2>
    { Object.keys(svgIcons).map(name => (
      <DemoRenderer key={name}>
        <Icon name={name} />
      </DemoRenderer>
    )) }
  </div>
);

export default IconDemo;

