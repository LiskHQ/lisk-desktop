import React from 'react';
import styles from './backgroundMaker.css';

const BackgroundMaker = ({ className }) => (
  <div className={`${styles.stageStripes} ${className}`}>
    <span className={styles.stageStripe}></span>
    <span className={styles.stageStripe}></span>
    <span className={styles.stageStripe}></span>
    <span className={styles.stageStripe}></span>
    <span className={styles.stageStripe}></span>
    <span className={styles.stageStripe}></span>
    <span className={styles.stageStripe}></span>
    <span className={styles.stageStripe}></span>
    <span className={styles.stageStripe}></span>
    <span className={styles.stageStripe}></span>
    <span className={styles.stageStripe}></span>
    <span className={styles.stageStripe}></span>
  </div>
);

export default BackgroundMaker;

