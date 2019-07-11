import React from 'react';
import styles from './backgroundMaker.css';

const BackgroundMaker = ({ className }) => (
  <div className={`${styles.stageStripes} ${className}`}>
    <span className={styles.stageStripe} />
    <span className={styles.stageStripe} />
    <span className={styles.stageStripe} />
    <span className={styles.stageStripe} />
    <span className={styles.stageStripe} />
    <span className={styles.stageStripe} />
    <span className={styles.stageStripe} />
    <span className={styles.stageStripe} />
    <span className={styles.stageStripe} />
    <span className={styles.stageStripe} />
    <span className={styles.stageStripe} />
    <span className={styles.stageStripe} />
  </div>
);

export default BackgroundMaker;
